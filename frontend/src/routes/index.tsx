import { Icon } from "@chakra-ui/react";
import { MdBarChart, MdPerson, MdHome, MdLock, MdOutlineShoppingCart, MdLink } from "react-icons/md";

// Admin Imports
// import MainDashboard from './pages/admin/default';
// import NFTMarketplace from './pages/admin/nft-marketplace';
// import Profile from './pages/admin/profile';
// import DataTables from './pages/admin/data-tables';
// import RTL from './pages/rtl/rtl-default';

// Auth Imports
// import SignInCentered from './pages/auth/sign-in';
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
    path: "/questions",
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    // component: NFTMarketplace,
    secondary: true,
  },
  {
    name: "Peer Coding",
    layout: "",
    path: "/peercoding",
    icon: <Icon as={MdLink} width="20px" height="20px" color="inherit" />,
    // component: NFTMarketplace,
    secondary: true,
  },
  {
    name: "Test collab room",
    layout: "",
    path: "/collabroom",
    icon: <Icon as={MdLink} width="20px" height="20px" color="inherit" />,
    // component: NFTMarketplace,
    secondary: true,
  },
  {
    name: "Profile",
    layout: "",
    path: "/profile",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    // component: SignInCentered,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    // component: SignInCentered,
  },
];

export default routes;
