import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  BuildingStorefrontIcon,
  CloudIcon,
} from "@heroicons/react/24/solid";
import {Home, Profile, Tables, Notifications} from "@/pages/dashboard";
import {SignIn} from "@/pages/auth";
import Restaurants from "./pages/dashboard/restaurants";
import Cloudinary from "./pages/dashboard/cloudinary";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <BuildingStorefrontIcon {...icon} />,
        name: "restaurants",
        path: "/restaurants",
        element: <Restaurants />,
      },
      {
        icon: <CloudIcon {...icon} />,
        name: "cloudinary",
        path: "/cloudinary",
        element: <Cloudinary />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
];

export default routes;
