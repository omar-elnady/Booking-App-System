import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navber";
import { useTheme } from "../hooks/useTheme";
import Footer from "../components/Footer";

const Layout = () => {
  useTheme();

  const { pathname } = useLocation();
  return (
    <>
      {pathname === "/login" ? null : <Navbar />}
      <Outlet />
      {pathname === "/login" ? null : <Footer />}
      
    </>
  );
};

export default Layout;
