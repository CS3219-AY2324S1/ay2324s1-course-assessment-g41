"use client";

// Chakra imports
import { Box, Grid } from "@chakra-ui/react";
import General from "src/views/admin/profile/components/General";

export default function ProfileOverview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Grid
        mb="20px"
        templateColumns={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1.34fr 1.62fr 1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <General gridArea={{ base: "1 / 1 / 2 / 3", lg: "1 / 1 / 2 / 4" }} minH="365px" pe="20px" />
      </Grid>
    </Box>
  );
}
