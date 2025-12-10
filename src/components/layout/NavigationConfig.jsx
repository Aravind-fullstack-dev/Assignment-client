import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";   // NEW ICON
import LogoutIcon from "@mui/icons-material/Logout";

export const NAVIGATION = {
  items: [
    { kind: "header", title: "Main items" },

    {
      segment: "dashboard",
      title: "Dashboard",
      icon: <DashboardIcon />,
    },

    {
      segment: "employee-management",
      title: "Employee Management",
      icon: <PeopleIcon />,
    },

    { kind: "divider" },
  ],

  footer: [
    {
      segment: "signout",
      title: "Sign Out",
      icon: <LogoutIcon />,
    },
  ],
};
