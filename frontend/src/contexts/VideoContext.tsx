import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import Peer, { SignalData } from "simple-peer";
import io, { Socket } from "socket.io-client";
import { HOST_API } from "@/config";
import { useToast } from "@chakra-ui/react";
import useTrackDependencies from "@/hooks/dev/useTrackDependencies";

// karwi: fix remote null
const log = (message: string, data: any = {}) => {
  console.log(`[VideoContext] ${message}`, data);
};

const logError = (message: string, error: any = {}) => {
  console.error(`[VideoContext Error] ${message}`, error);
};

interface VideoContextValue {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCameraOn: boolean;
  isMicrophoneOn: boolean;
  isLoading: boolean;
  toggleCamera: () => void;
  toggleMicrophone: () => void;
}

export const VideoContext = createContext<VideoContextValue | undefined>(undefined);

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideoContext must be used within a VideoContextProvider");
  }
  return context;
};

interface VideoContextProviderProps {
  children: ReactNode;
  roomId: string;
}

const initializeSocket = (roomId: string) => {
  return io(HOST_API, {
    path: "/videostreaming/socket.io",
    query: { roomId },
  });
};

export const VideoContextProvider: React.FC<VideoContextProviderProps> = ({ children, roomId }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const callPeerConnectionRef = useRef<Peer.Instance | null>(null);
  const answerPeerConnectionRef = useRef<Peer.Instance | null>(null);
  const prevLocalStreamRef = useRef<MediaStream | null>(null);
  const toast = useToast();
  const socket = useRef<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize socket on first render
    if (!socket.current) {
      log("initializeSocket", roomId);
      socket.current = initializeSocket(roomId);
    }

    // Cleanup on unmount
    return () => {
      if (socket.current) {
        log("disconnect socket", roomId);
        socket.current.disconnect();
      }
    };
  }, [roomId]);

  const startLocalStream = useCallback(
    async (isVideoOn: boolean, isAudioOn: boolean) => {
      log("startLocalStream");
      setIsLoading(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoOn,
          audio: isAudioOn,
        });
        log("startLocalStream: setLocalStream", stream);
        setLocalStream(stream);
        toast({
          title: "Local stream started",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        logError("Error accessing media devices.", error);
        toast({
          title: "Failed to start local stream",
          description: String(error),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  const stopLocalStream = useCallback(() => {
    log("stopLocalStream");
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      log("stopLocalStream: setLocalStream null");
      setLocalStream(null);
      log("emit streamStopped");
      socket.current?.emit("streamStopped", { roomId });
    }
  }, [localStream, socket, roomId]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    } else {
      startLocalStream(true, false); // Start the stream if not already started
    }
    setIsCameraOn((prev) => !prev);
  }, [localStream, startLocalStream]);

  const toggleMicrophone = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    } else {
      startLocalStream(false, true); // Start the stream if not already started
    }
    setIsMicrophoneOn((prev) => !prev);
  }, [localStream, startLocalStream]);

  useEffect(() => {
    return () => {
      stopLocalStream(); // Stop the stream when the component unmounts
    };
  }, [stopLocalStream]);

  const createAndSetupPeer = useCallback(
    (initiator: boolean, signal?: SignalData) => {
      const peer = new Peer({
        initiator,
        trickle: false,
        stream: localStream ?? undefined,
      });

      peer.on("error", (err) => {
        logError("Peer connection error:", err);
        // toast({
        //   title: "Peer Connection Error",
        //   description: String(err),
        //   status: "error",
        //   duration: 5000,
        //   isClosable: true,
        // });
      });

      peer.on("connect", () => {
        log("Peer connection established");
      });

      peer.on("close", () => {
        log("Peer connection closed");
      });

      peer.on("stream", (data) => {
        log("createAndSetupPeer: setRemoteStream", data);
        setRemoteStream(data);
      });

      if (signal) {
        peer.signal(signal);
      }

      return peer;
    },
    [localStream],
  );

  const callPeer = useCallback(() => {
    console.log(`VideoContext: Calling peer ${roomId}`);
    const peer = createAndSetupPeer(true);

    peer.on("signal", (data) => {
      socket.current?.emit("callUser", { roomId: roomId, signalData: data });
    });

    callPeerConnectionRef.current = peer;
    toast({
      title: "Call Initiated",
      description: `Calling room ${roomId}`,
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  }, [createAndSetupPeer, socket, roomId, toast]);

  const answerCall = useCallback(
    (signal: SignalData) => {
      log("Answering call");
      const peer = createAndSetupPeer(false, signal);

      peer.on("signal", (data) => {
        socket.current?.emit("answerCall", { roomId, signal: data });
      });

      answerPeerConnectionRef.current = peer;
      toast({
        title: "Call Answered",
        description: `Joined room ${roomId}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    [createAndSetupPeer, socket, roomId, toast],
  );

  const leaveCall = useCallback(() => {
    log("Leaving call");
    // Close call peer connection
    if (callPeerConnectionRef.current) {
      callPeerConnectionRef.current.destroy();
      callPeerConnectionRef.current = null;
    }
    // Close answer peer connection
    if (answerPeerConnectionRef.current) {
      answerPeerConnectionRef.current.destroy();
      answerPeerConnectionRef.current = null;
    }

    // if (peerConnectionRef.current) {
    //   peerConnectionRef.current.destroy();
    //   peerConnectionRef.current = null;
    //   toast({
    //     title: "Left Call",
    //     description: "You have left the call.",
    //     status: "warning",
    //     duration: 5000,
    //     isClosable: true,
    //   });
    // }
  }, []);

  useTrackDependencies("VideoContext", [answerCall, socket]);

  useEffect(() => {
    log("Setting up socket event listeners");

    socket.current?.on("connect", () => {
      log("Successfully connected to socket server");
      toast({
        title: "Connected",
        description: "Connected to the socket server.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    });

    socket.current?.on("error", (error) => {
      logError("Socket error: ", error);
      // toast({
      //   title: "Socket Error",
      //   description: "An error occurred with the socket connection.",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      // });
    });

    socket.current?.on("callUser", (data) => {
      log("Received call from peer");
      toast({
        title: "Incoming Call",
        description: "You're receiving a call.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      answerCall(data.signal);
    });

    socket.current?.on("callAccepted", (signal) => {
      log("Call accepted by peer");
      toast({
        title: "Call Accepted",
        description: "Your call has been accepted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      if (callPeerConnectionRef.current) {
        callPeerConnectionRef.current.signal(signal);
      }
    });

    socket.current?.on("streamStopped", () => {
      log("Remote peer's stream stopped.");
      log("streamStopped: setRemoteStream(null)");
      setRemoteStream(null);
      toast({
        title: "Stream Stopped",
        description: "The remote peer's stream has stopped.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    });

    socket.current?.on("roomFull", (roomId) => {
      console.log(`VideoContext: Cannot join room ${roomId}, it is already full.`);
      toast({
        title: "Room Full",
        description: `Cannot join room ${roomId}, it is already full.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });

    socket.current?.on("peerDisconnected", ({ peerId }) => {
      console.log(`VideoContext: Peer disconnected: ${peerId}`);
      toast({
        title: "Peer Disconnected",
        description: "A peer has disconnected.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      if (peerId !== socket.current?.id) {
        log("peerDisconnected: setRemoteStream(null)");
        setRemoteStream(null);
      }
    });

    return () => {
      log("Cleaning up socket event listeners");
      socket.current?.off("callUser");
      socket.current?.off("callAccepted");
      socket.current?.off("error");
      socket.current?.off("streamStopped");
      socket.current?.off("roomFull");
      socket.current?.off("peerDisconnected");
    };
    // karwi: fix deps
  }, [answerCall, socket, toast]);

  useEffect(() => {
    log("Checking for call initiation or reinitiation.");

    // Initiate or reinitiate call if room ID is set and either:
    // - The local stream has been updated and not null
    if (roomId && localStream && prevLocalStreamRef.current !== localStream) {
      console.log(`VideoContext: Initiating call with room ID ${roomId}.`);
      callPeer();
    }

    // Store the current local stream for comparison in the next effect run
    prevLocalStreamRef.current = localStream;

    return () => {
      console.log("Leaving call due to component unmount, room ID change, or local stream update.");
      leaveCall();
    };
  }, [roomId, localStream, callPeer, leaveCall]);

  return (
    <VideoContext.Provider
      value={{
        localStream,
        remoteStream,
        isCameraOn,
        isMicrophoneOn,
        isLoading,
        toggleCamera,
        toggleMicrophone,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
