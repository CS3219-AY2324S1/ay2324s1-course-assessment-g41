"use client";
import React, { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import theme from "../src/theme/theme";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { googleAuthProvider } from "@/authProviders/google";
import { MatchingProvider } from "@/contexts/MatchingContext";

export default function AppWrappers({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ProfileProvider authProvider={googleAuthProvider}>
          <MatchingProvider>{children}</MatchingProvider>
        </ProfileProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
