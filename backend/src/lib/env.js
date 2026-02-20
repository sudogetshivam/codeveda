import dotenv from "dotenv";

dotenv.config()

export const ENV = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    STREAM_API_SECRET: process.env.STREAM_API_SECRET,
    STREAM_API_KEY: process.env.STREAM_API_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    JDOODLE_CLIENT_ID: process.env.JDOODLE_CLIENT_ID,
    JDOODLE_CLIENT_SECRET: process.env.JDOODLE_CLIENT_SECRET,
} //actually here you are just making an object