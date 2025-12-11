import * as React from "react";
import PropTypes from "prop-types";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider, useDemoRouter } from "@toolpad/core/internal";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { NAVIGATION } from "./NavigationConfig";
import Dashboard from "../../pages/Dashboard/Dashboard";
import EmployeeManagement from "../../pages/EmployeeManagement/EmployeeManagement";

// Theme with dark/light mode
const demoTheme = createTheme({
  cssVariables: { colorSchemeSelector: "data-toolpad-color-scheme" },
  colorSchemes: { light: true, dark: true },
});

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    toast.error("You must be logged in to access this page");
    window.location.href = "/login";
    return null;
  }
  return children;
};

// Sign out handler
const handleSignOut = () => {
  localStorage.removeItem("authToken");
  toast.success("Logged out successfully!");
  window.location.href = "/login";
};

// Page routing
function renderPage(pathname) {
  switch (pathname) {
    case "/dashboard":
      return (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      );
    case "/employee-management":
      return (
        <ProtectedRoute>
          <EmployeeManagement />
        </ProtectedRoute>
      );
    case "/signout":
      handleSignOut(); // trigger sign out
      return null;
    default:
      return <div>404 - Page Not Found</div>;
  }
}

function SideBar(props) {
  const { window } = props;
  const router = useDemoRouter("/dashboard");
  const demoWindow = window !== undefined ? window() : undefined;

  // Combine items and footer into single array for Toolpad
  const navigationArray = [
    ...NAVIGATION.items,
    ...NAVIGATION.footer.map((f) => ({ ...f, bottomNavigation: true })),
  ];

  return (
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={navigationArray}
        branding={{
          logo: '',
          title: "Employee Portal",
        }}
        router={router}
        theme={demoTheme}
      >
        {/* Toast container for notifications */}
        <ToastContainer position="top-right" autoClose={3000} />
        
        <DashboardLayout>
          {renderPage(router.pathname)}
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}

SideBar.propTypes = {
  window: PropTypes.func,
};

export default SideBar;
