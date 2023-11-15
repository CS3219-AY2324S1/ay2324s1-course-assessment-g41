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
    // component: MainDashboard,
  },
  {
    name: "Coding Questions",
    layout: "",
    path: "/coding-questions",
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    // component: NFTMarketplace,
    secondary: true,
  },
  {
    name: "Past Attempts",
    layout: "",
    path: "/attempts",
    icon: <Icon as={MdHistory} width="20px" height="20px" color="inherit" />,
    // component: MainDashboard,
  },
];

export default routes;
