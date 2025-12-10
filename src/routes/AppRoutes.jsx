import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "../pages/Login/LoginPage";
import SideBar from "../components/layout/SideBar";  // use Toolpad layout
import Signup from "../pages/Signup/Signup";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<Signup />} />
      {/* Dashboard + Toolpad Navigation */}
      <Route path="/dashboard/*" element={<SideBar />} />

      <Route path="*" element={<h1>404: Page Not Found</h1>} />
    </Routes>
  );
}

export default AppRoutes;
