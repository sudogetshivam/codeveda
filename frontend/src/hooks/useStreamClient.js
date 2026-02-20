import React from 'react'
import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;
    let cancelled = false; // Guard against stale async closures

    const initCall = async () => {
      if (!session?.callId || (!isHost && !isParticipant)) {
        setIsInitializingCall(false);
        return;
      }

      try {
        const { token, userId, userName, userImage } = await sessionApi.getStreamToken();
        if (cancelled) return; // Component unmounted before token came back

        const client = await initializeStreamClient({ id: userId, name: userName, image: userImage }, token);
        if (cancelled) return;

        setStreamClient(client);

        videoCall = client.call("default", session.callId);
        await videoCall.join({ create: true });
        if (cancelled) {
          await videoCall.leave();
          return;
        }
        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser({ id: userId, name: userName, image: userImage }, token);
        if (cancelled) return;

        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel("messaging", session.callId);
        await chatChannel.watch();
        setChannel(chatChannel);

      } catch (error) {
        if (!cancelled) {
          toast.error("Failed to join video call");
          console.error("Error init call", error);
        }
      } finally {
        if (!cancelled) setIsInitializingCall(false);
      }
    }

    if (session && !loadingSession) {
      initCall();
    }

    // cleanup - runs when callId changes or component unmounts
    return () => {
      cancelled = true;
      (async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    }
  }, [session?.callId, loadingSession, isHost, isParticipant]) // Re-init when role changes (e.g. participant joins via room key)

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall

  }
}




export default useStreamClient
