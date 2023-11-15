"use client";

import { Role } from "@/@types/user";
import useAuthRole from "@/hooks/guards/useAuthRole";
import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function QuestionLayout({ children }: { children: ReactNode }) {
  // useAuthRole([Role.ADMIN]);
  return <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>{children}</Box>;
}
