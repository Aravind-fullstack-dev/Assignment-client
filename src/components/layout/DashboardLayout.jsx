import React from "react";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import Sidebar from "../layout/SideBar";

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, bgcolor: "#fafafa", minHeight: "100vh" }}>
        {/* Top Header */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: "white", color: "black", borderBottom: "1px solid #ddd" }}>
          <Toolbar>
            <Typography variant="h6">LMV Dashboard</Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
