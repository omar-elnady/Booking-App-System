import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
//    import Router Pages

export default function App() {
  // const [userData, setUserData] = useState(null);
  // useEffect(() => {
  //   if (localStorage.getItem("userToken")) {
  //     getUserData();
  //   }
  // }, []);
  // function getUserData() {
  //   const token = localStorage.getItem("userToken");
  //   setUserData(jwtDecode(token));
  // }
  // function ProdectedRoute({ children }) {
  //   if (!localStorage.getItem("userToken")) {
  //     return <Navigate to="/sign-in" />;
  //   }
  //   return children;
  // }
  // function IsLogin({ children }) {
  //   if (localStorage.getItem("userToken")) {
  //     return <Navigate to="/" />;
  //   }
  //   return children;
  // }
  // function logout() {
  //   localStorage.removeItem("userToken");
  //   window.location.href = "/sign-in";
  // }
  // window.addEventListener("storage", () => {
  //   window.location.reload(true);
  // });

  let routers = createBrowserRouter([
    {
      path: "/",
      element: (
        // <ProdectedRoute>
        <Layout
        // userData={userData} logout={logout}
        />
        // </ProdectedRoute>
      ),
      children: [
        { path: "/", element: <Home /> },
        { path: "/events", element: <Events /> },
      ],
    },
  ]);
  return <RouterProvider router={routers} />;
}
