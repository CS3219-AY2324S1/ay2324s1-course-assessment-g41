// Chakra imports
import { PATH_MAIN } from "@/routes/paths";
import { Link } from "@chakra-ui/next-js";
import { Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { PeerPrepLogo } from "src/components/icons/Icons";
import { HSeparator } from "src/components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");
  // let mainText = useColorModeValue('navy.700', 'white');

  return (
    <Flex alignItems="center" flexDirection="column">
      <Link href={PATH_MAIN.general.dashboard}>
        <PeerPrepLogo h="130px" w="875px" color={logoColor} />
      </Link>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
