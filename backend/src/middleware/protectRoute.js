import { requireAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/streams.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      const clerkUser = await clerkClient.users.getUser(clerkId);
        const emailStr =clerkUser.primaryEmailAddress?.emailAddress ??
          clerkUser.emailAddresses?.[0]?.emailAddress ??
          `${clerkId}@clerk.user`;

      // find user in db by clerk ID
      let user = await User.findOne({ email: emailStr });


      if(user && user.clerkId == clerkId){
        req.user = user;
        return next();
      }

      if(user && user.clerkId !== clerkId) {
        // This should never happen, but if it does, we want to know about it and fix the data
        // console.warn(`Data inconsistency: user with email ${user.email} has clerkId ${user.clerkId}, expected ${clerkId}`);
        // user.clerkId = clerkId;
        // await user.save();

        await User.deleteOne({ _id: user._id });
        
        const newUser = {
          clerkId: clerkUser.id,
          email: emailStr,
          name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "User",
          profileImage: clerkUser.imageUrl ?? "",
        };
        try {
          user = await User.create(newUser);
          await upsertStreamUser({
            id: newUser.clerkId.toString(),
            name: newUser.name,
            image: newUser.profileImage,
          });
        } catch (createErr) {
          // race: another request already created the user (e.g. webhook or parallel request)
          if (createErr.code === 11000) {
            user = await User.findOne({ clerkId });
          }
          if (!user) throw createErr;
        }

      }

      // if user not in DB (e.g. webhook missed or not yet processed), sync from Clerk
      if (!user) {
        const newUser = {
          clerkId: clerkUser.id,
          email: emailStr,
          name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "User",
          profileImage: clerkUser.imageUrl ?? "",
        };
        try {
          user = await User.create(newUser);
          await upsertStreamUser({
            id: newUser.clerkId.toString(),
            name: newUser.name,
            image: newUser.profileImage,
          });
        } catch (createErr) {
          // race: another request already created the user (e.g. webhook or parallel request)
          if (createErr.code === 11000) {
            user = await User.findOne({ clerkId });
          }
          if (!user) throw createErr;
        }
      }

      if (!user) {
        return res.status(500).json({ message: "Could not load or create user. Please try again." });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      const status = error.status || 500;
      const message = error.message || "Internal Server Error";
      res.status(status).json({ message });
    }
  },
];