// components/VideoStream.tsx
import React, { useRef, useEffect } from "react";
import { Flex, Box, IconButton, Button, Stack, useColorModeValue } from "@chakra-ui/react";
import { MdVideocam, MdVideocamOff, MdMic, MdMicOff } from "react-icons/md";
import { useVideoContext } from "@/contexts/VideoContext";

const log = (message: string, data: any = {}) => {
  console.log(`[VideoStream] ${message}`, data);
};

const logError = (message: string, error: any = {}) => {
  console.error(`[VideoStream Error] ${message}`, error);
};

const VideoStream: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const bgColor = useColorModeValue("whiteAlpha.600", "blackAlpha.600");
  const {
    localStream,
    remoteStream,
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
    isMicrophoneOn,
    isLoading,
  } = useVideoContext();

  useEffect(() => {
    if (localVideoRef.current) {
      log("localStream", localStream);
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      log("remoteStream", remoteStream);
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <Stack direction={["column", "row"]} spacing={4} align="center" justify="center">
      {localStream ? (
        <Box position="relative" width="160px" height="120px" bg="black" borderRadius="lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)",
              borderRadius: "8px",
            }}
          />
          <Flex
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            justify="space-around"
            bg={bgColor}
            p={0.5}
            borderRadius="lg"
            overflow="hidden"
          >
            <IconButton
              aria-label="Toggle camera"
              icon={isCameraOn ? <MdVideocam /> : <MdVideocamOff />}
              onClick={toggleCamera}
              size="sm"
              variant="ghost"
            />
            <IconButton
              aria-label="Toggle microphone"
              icon={isMicrophoneOn ? <MdMic /> : <MdMicOff />}
              onClick={toggleMicrophone}
              size="sm"
              variant="ghost"
            />
          </Flex>
        </Box>
      ) : (
        <Button onClick={toggleCamera} colorScheme="blue" size="md" isLoading={isLoading}>
          Start Video Call
        </Button>
      )}
      {/* karwi: hacky fix for unstable remote stream */}
      {remoteStream && localStream && (
        <Box position="relative" width="160px" height="120px" bg="black" borderRadius="lg">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)",
              borderRadius: "8px",
            }}
          />
        </Box>
      )}
    </Stack>
  );
};

export default VideoStream;
