import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navber";
import { useTheme } from "../hooks/useTheme";

const Layout = () => {
  useTheme();

  const { pathname } = useLocation();
  return (
    <>
      {pathname === "/login" ? null : <Navbar />}
      <Outlet />
    </>
  );
};

export default Layout;
