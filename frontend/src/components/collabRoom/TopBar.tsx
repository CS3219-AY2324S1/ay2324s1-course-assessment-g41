// components/TopBar.tsx
import React, { useRef, useState } from "react";
import {
  Box,
  Flex,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";
import { OptionBase, Select, SingleValue } from "chakra-react-select";

interface OptionType extends OptionBase {
  value: string;
  label: string;
}

const TopBar = () => {
  const { languageTotalList, currentAttempt, listOfAttempts, onLanguageChange, onCloseRoom } =
    useCollabContext();
  const [isCloseRoomModalOpen, setIsCloseRoomModalOpen] = useState(false);
  const cancelRef = useRef(null);

  const onCloseCloseRoomModal = () => setIsCloseRoomModalOpen(false);

  const handleCloseRoom = () => {
    console.log("[TopBar] Closing room...");
    onCloseRoom();
    setIsCloseRoomModalOpen(false); // Close the confirmation modal
  };

  const handleLanguageChange = (selectedOption: SingleValue<OptionType>) => {
    if (!selectedOption) {
      return;
    }
    onLanguageChange(selectedOption);
  };

  const currentLanguage = currentAttempt?.language;
  const options = languageTotalList;
  const currentPage = listOfAttempts.findIndex(
    (attempt) => attempt.attemptId === currentAttempt.attemptId,
  );

  return (
    <Flex align="center" justify="space-between" pb={4}>
      <Box w="100%" maxW={200}>
        <Select
          options={options}
          onChange={handleLanguageChange}
          value={currentLanguage}
          placeholder="Select language"
          isDisabled={currentPage < 0}
        />
      </Box>

      {/* Position the Close Room button on the right */}
      <Button colorScheme="red" onClick={() => setIsCloseRoomModalOpen(true)}>
        Leave
      </Button>

      {/* AlertDialog for closing room confirmation */}
      <AlertDialog
        isOpen={isCloseRoomModalOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseCloseRoomModal}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Leave Room
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to leave this room? You will be redirected to the dashboard
              page.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseCloseRoomModal}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleCloseRoom} ml={3}>
                Leave Room
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default TopBar;
