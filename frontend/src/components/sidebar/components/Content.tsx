// chakra imports
import { Box, Flex, Stack } from "@chakra-ui/react";
//   Custom components
import Brand from "src/components/sidebar/components/Brand";
import { SidebarLinks } from "src/components/sidebar/components/Links";
import SidebarCard from "src/components/sidebar/components/SidebarCard";
import { IRoute } from "src/@types/navigation";

// FUNCTIONS

interface SidebarContentProps {
  routes: IRoute[];
}

function SidebarContent(props: SidebarContentProps) {
  const { routes } = props;
  // SIDEBAR
  return (
    <Flex direction="column" height="100%" pt="25px" borderRadius="30px">
      <Brand />
      <Stack direction="column" mt="8px" mb="auto">
        <Box ps="20px" pe={{ lg: "16px", "2xl": "16px" }}>
          <SidebarLinks routes={routes} />
        </Box>
      </Stack>

      {/* <Box borderRadius="30px">
        <video
          src={'/img/dashboards/sidebarcard2.mp4'}
          autoPlay
          muted
          loop
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            // borderRadius: '0 0 0 100px',
          }}
        />
      </Box> */}
    </Flex>
  );
}

export default SidebarContent;
