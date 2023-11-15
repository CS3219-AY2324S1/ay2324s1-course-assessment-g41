import React, { useEffect, useCallback } from "react";
import { Button, IconButton, Text, Flex, Box } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";
import { MdSaveAs } from "react-icons/md";

const AttemptActions = () => {
  const { listOfAttempts, onNewAttempt, onSaveAttempt, onAttemptChange, currentAttempt } =
    useCollabContext();

  const currentPage = listOfAttempts.findIndex(
    (attempt) => attempt.attemptId === currentAttempt.attemptId,
  );

  // console.log(currentPage, "currentPage", listOfAttempts);

  const handlePageChange = useCallback(
    async (pageIndex: number) => {
      const selectedAttempt = listOfAttempts[pageIndex];
      if (selectedAttempt) {
        await onAttemptChange(selectedAttempt.attemptId);
      }
    },
    [listOfAttempts, onAttemptChange],
  );

  useEffect(() => {
    // on mount, create a new attempt
    handlePageChange(1); // Set the first page as default display
    // karwi: fix deps
  }, []);

  const handleNewAttempt = () => {
    if (currentAttempt) {
      onNewAttempt();
    }
  };

  const handleSaveAttempt = () => {
    onSaveAttempt();
  };

  return (
    <Box mt={4}>
      <Flex align="center" justify="space-between" wrap="wrap">
        <Flex align="center" justify="center" wrap="wrap" mr={4}>
          <IconButton
            aria-label="Previous Page"
            icon={<ChevronLeftIcon />}
            isDisabled={currentPage <= 0}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          <Text mx={2}>{currentPage + 1}</Text>
          <IconButton
            aria-label="Next Page"
            icon={<ChevronRightIcon />}
            isDisabled={currentPage === listOfAttempts.length - 1}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Flex>
        {currentAttempt && (
          <>
            <IconButton
              aria-label="Save Attempt"
              icon={<MdSaveAs />}
              onClick={handleSaveAttempt}
              colorScheme="green"
              variant="outline"
              isDisabled={currentPage < 0}
            />
          </>
        )}
        <Button colorScheme="blue" onClick={handleNewAttempt}>
          New Attempt
        </Button>
      </Flex>
    </Box>
  );
};

export default AttemptActions;
