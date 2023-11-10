// context/VideoContextProvider.tsx
import { SignalingClient } from "@/@types/video";
import { useToast } from "@chakra-ui/react";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  useRef,
} from "react";

interface VideoContextValue {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startLocalStream: () => Promise<void>;
  stopLocalStream: () => void;
  // karwi: clean up using the returned callback
  connectToRemoteStream: () => Promise<() => void>;
  isCameraOn: boolean;
  isMicrophoneOn: boolean;
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
  signalingClient: SignalingClient;
}

export const VideoContextProvider: React.FC<VideoContextProviderProps> = ({
  children,
  signalingClient,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const prevCameraOnRef = useRef(isCameraOn);
  const prevMicrophoneOnRef = useRef(isMicrophoneOn);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const toast = useToast();

  const handleError = useCallback(
    (error: unknown, message: string) => {
      // Type assertion to cast the error to an Error object
      const errorObj = error instanceof Error ? error : new Error(String(error));
      console.error(errorObj);
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    },
    [toast],
  );

  const startLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isCameraOn,
        audio: isMicrophoneOn,
      });
      console.log("karwi: setlocalstream");
      setLocalStream(stream);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  }, [isCameraOn, isMicrophoneOn]);

  const stopLocalStream = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(null); // This ensures the reference is cleared and React re-renders if needed
    }
  }, [localStream]);

  const toggleCamera = useCallback(async () => {
    setIsCameraOn((prev) => !prev);
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      } else {
        // No video track, need to get one
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        newStream.getVideoTracks().forEach((track) => localStream.addTrack(track));
      }
    }
  }, [localStream]);

  const toggleMicrophone = useCallback(async () => {
    setIsMicrophoneOn((prev) => !prev);
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      } else {
        // No audio track, need to get one
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        newStream.getAudioTracks().forEach((track) => localStream.addTrack(track));
      }
    }
  }, [localStream]);

  useEffect(() => {
    // Check if the values have changed
    if (prevCameraOnRef.current === isCameraOn && prevMicrophoneOnRef.current === isMicrophoneOn) {
      // If there's no change, do nothing
      return;
    }

    // Update the refs with the new values
    prevCameraOnRef.current = isCameraOn;
    prevMicrophoneOnRef.current = isMicrophoneOn;

    // If the camera or microphone needs to be started or stopped, do so
    if (isCameraOn || isMicrophoneOn) {
      startLocalStream();
    } else {
      stopLocalStream();
    }

    // Cleanup function for unmounting
    return () => {
      stopLocalStream();
    };
  }, [isCameraOn, isMicrophoneOn, startLocalStream, stopLocalStream]);

  // karwi: refactor
  const connectToRemoteStream = useCallback(async () => {
    try {
      await signalingClient.connect();
      toast({ title: "Connecting...", status: "info", duration: 3000 });

      // Create a new RTCPeerConnection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302", // Using Google's public STUN server
          },
          // ... You can add more STUN/TURN servers as needed
        ],
      });
      peerConnectionRef.current = peerConnection;

      // Set up event handlers for peer connection
      peerConnection.ontrack = (event) => {
        // Set the remote stream
        setRemoteStream(event.streams[0]);
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          signalingClient.sendIceCandidate(event.candidate).catch((error) => {
            handleError(error, "Failed to send ICE candidate.");
          });
        }
      };

      // Create an offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Send the offer to the remote peer via your signaling service
      signalingClient.sendOffer(offer);

      // Listen for the answer from the remote peer
      signalingClient.onAnswer(async (answer) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      });

      // Listen for ICE candidates from the remote peer
      signalingClient.onIceCandidate(async (candidate) => {
        if (candidate) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      // Handle the negotiationneeded event (in case renegotiation is needed)
      peerConnection.onnegotiationneeded = async () => {
        try {
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          signalingClient.sendOffer(offer);
        } catch (error) {
          console.error("Failed to create offer on negotiation needed", error);
        }
      };

      // Connection state change handler with user feedback
      peerConnection.onconnectionstatechange = () => {
        switch (peerConnection.connectionState) {
          case "connected":
            toast({ title: "Connected", status: "success", duration: 3000 });
            break;
          case "disconnected":
          case "failed":
            handleError(
              new Error("Connection failed"),
              "Connection lost. Please try reconnecting.",
            );
            break;
          case "closed":
            toast({ title: "Disconnected", status: "warning", duration: 3000 });
            break;
          default:
            break;
        }
      };
      return () => {
        peerConnection.close();
        peerConnectionRef.current = null;
      };
    } catch (error) {
      handleError(error, "Failed to connect to remote stream.");
      return () => {};
    }
  }, [handleError, signalingClient, toast]);

  useEffect(() => {
    const peerConnection = peerConnectionRef.current;

    if (peerConnection) {
      // Remove any existing tracks
      peerConnection.getSenders().forEach((sender) => {
        peerConnection.removeTrack(sender);
      });

      if (localStream) {
        // Add new tracks to the connection
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });
      }
    }
  }, [localStream, signalingClient]);

  // The rest of your context provider remains the same
  return (
    <VideoContext.Provider
      value={{
        localStream,
        remoteStream,
        startLocalStream,
        stopLocalStream,
        connectToRemoteStream,
        isCameraOn,
        isMicrophoneOn,
        toggleCamera,
        toggleMicrophone,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
