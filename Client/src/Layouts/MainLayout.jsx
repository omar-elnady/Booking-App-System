import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navber";
import { useTheme } from "../hooks/useTheme";
import Footer from "../components/Footer";
import { Toaster } from "sonner";

const MainLayout = () => {
  useTheme();


  const { pathname } = useLocation();
  return (
    <>
      {pathname === "/login" ? null : (
        <Navbar/>
      )}
      <Outlet />
      <Toaster />
      {pathname === "/login" ? null : <Footer />}
    </>
  );
};

export default MainLayout;
