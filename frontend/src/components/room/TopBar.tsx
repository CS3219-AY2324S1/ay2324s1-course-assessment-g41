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

const TopBar = ({ attempt }: { attempt: { language: { label: string; value: string } } }) => {
  return (
    <Flex align="center" justify="space-between" pb={4}>
      <Box w="100%" maxW={200}>
        <Select options={[attempt.language]} isDisabled={true} value={attempt.language} />
      </Box>
    </Flex>
  );
};

export default TopBar;
