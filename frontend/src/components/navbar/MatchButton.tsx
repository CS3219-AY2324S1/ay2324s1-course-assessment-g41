import React, { useState, useRef, FC, useCallback, useEffect } from "react";
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { QuestionComplexity } from "@/@types/models/question";
import { useMatching } from "@/hooks/matching/useMatchingRequest";
import { Status } from "@/@types/status";
import { openRoom } from "@/services/room";
import { useMatchingContext } from "@/contexts/MatchingContext";
import { useForm } from "react-hook-form";
import ControlledSelect from "../form/ControlledSelect";
import { OptionBase } from "chakra-react-select";
import { useRouter } from "next/navigation";

interface OptionType extends OptionBase {
  value: string;
  label: string;
}

type ButtonProps = React.ComponentProps<typeof Button>;

const MatchButton: FC<ButtonProps> = (buttonProps) => {
  const [countdown, setCountdown] = useState<number>(30); // 30 seconds countdown
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { control, watch } = useForm();
  const selectedComplexity = watch("complexity"); // Watch the complexity selection
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { sendMatchingRequest, getMatchingStatus } = useMatching();
  const { setComplexity } = useMatchingContext();
  const requestExpiryTimeInSeconds = 30;
  const intervalId = useRef<NodeJS.Timeout>(); // useRef to hold the interval ID

  // Complexity options created from QuestionComplexity enum/object
  const complexityOptions: OptionType[] = Object.values(QuestionComplexity).map((complexity) => ({
    value: complexity,
    label: complexity,
  }));

  useEffect(() => {
    // This function is called when the component mounts
    return () => {
      // Cleanup function: called when the component unmounts
      if (intervalId.current !== null) {
        window.clearInterval(intervalId.current);
      }
    };
  }, []);

  const cancelMatching = () => {
    clearInterval(intervalId.current);
    setIsLoading(false);
    setCountdown(30); // Reset countdown
    toast({
      title: "Matching Cancelled",
      description: "You have cancelled the matching process.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const onRoomPaired = useCallback(
    (response: any) => {
      if (response.roomId) {
        openRoom(response.roomId).then(() => {
          setComplexity(selectedComplexity);
          router.push(`/collab-room/${response.roomId}`);
        });
      }
    },
    [selectedComplexity, setComplexity, router],
  );

  const handleMatchingResponse = useCallback(
    (response: any) => {
      if (response.status === Status.paired) {
        setIsLoading(false);
        onRoomPaired(response);
      } else if (response.status === Status.expired) {
        setIsLoading(false);
      }
    },
    [onRoomPaired],
  );

  const startMatching = () => {
    if (!selectedComplexity) {
      toast({
        status: "error",
        description: "Please select a complexity level.",
        isClosable: true,
        duration: 3000,
        position: "bottom",
      });
      return;
    }

    setIsLoading(true);
    setCountdown(requestExpiryTimeInSeconds); // Set the initial countdown
    onClose();

    sendMatchingRequest(selectedComplexity).then(async () => {
      intervalId.current = setInterval(() => {
        setCountdown((prevCountdown) => {
          // Check the matching status every second
          getMatchingStatus()
            .then((response) => {
              handleMatchingResponse(response);
            })
            .catch(() => {
              toast({
                status: "error",
                description: "Error occurred during matching. Please try again later.",
                isClosable: true,
                duration: 3000,
                position: "bottom",
              });
            });

          // Countdown logic
          if (prevCountdown <= 1) {
            clearInterval(intervalId.current);
            setIsLoading(false);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    });
  };

  return (
    <>
      <Button
        onClick={isLoading ? cancelMatching : onOpen}
        isDisabled={isLoading && countdown === 0}
        colorScheme={isLoading ? "red" : "blue"} // Red for cancel, blue for start
        {...buttonProps}
      >
        {isLoading ? `Cancel Matching (${countdown}s)` : "Find Match"}
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Select Complexity
            </AlertDialogHeader>

            <AlertDialogBody>
              <ControlledSelect
                control={control}
                name="complexity"
                id="complexity"
                label="Complexity Level"
                options={complexityOptions}
                placeholder="Select complexity"
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="blue"
                onClick={startMatching}
                isDisabled={!selectedComplexity} // Disable button if no complexity is selected
              >
                Start Matching
              </Button>
              <Button ref={cancelRef} onClick={onClose} ml={3}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default MatchButton;
