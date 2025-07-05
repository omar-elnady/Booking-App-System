import React, { useState } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = ({ userType = "admin" }) => {
  return (
    <div className="min-h-screen ">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
