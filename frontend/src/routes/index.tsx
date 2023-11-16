import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdLink,
  MdHistory,
} from "react-icons/md";

import { IRoute } from "src/@types/navigation";

const routes: IRoute[] = [
  {
    name: "Dashboard",
    layout: "",
    path: "/dashboard",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    isHidden: false,
  },
  {
    name: "Coding Questions",
    layout: "",
    path: "/coding-questions",
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    secondary: true,
    isHidden: false,
  },
  {
    name: "Past Attempts",
    layout: "",
    path: "/attempts",
    icon: <Icon as={MdHistory} width="20px" height="20px" color="inherit" />,
    isHidden: false,
  },
  {
    name: "Interview Room",
    layout: "",
    path: "/collab-room",
    icon: <Icon as={MdHistory} width="20px" height="20px" color="inherit" />,
    isHidden: true,
  },
];

export default routes;
