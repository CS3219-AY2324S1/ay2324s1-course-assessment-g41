import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function QuestionLayout({ children }: { children: ReactNode }) {
  return <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>{children}</Box>;
}
