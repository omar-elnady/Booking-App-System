import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import { useAuth } from "./context/UserContext";
//    import Router Pages
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import { PasswordSettings } from "./components/Dashboard/PasswordSettings";
import { UserProfile } from "./components/Dashboard/UserProfile";
import DashboardLayout from "./Layouts/DashboardLayout";
import ManageEvents from "./pages/ManageEvents";

export default function App() {
  const { userData } = useAuth();
  function ProdectedAdminRoute({ children }) {
    if (!localStorage.getItem("userToken") || userData?.role == "User") {
      return <Navigate to="/" />;
    }
    return children;
  }

  let routers = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/events", element: <Events /> },
        { path: "/events/:eventId", element: <EventDetails /> },
        {
          path: "/login",
          element: <Login />,
        },
        // { path: "*", element: <Navigate to="/" /> },
      ],
    },
    {
      path: "/",
      element: (
        <ProdectedAdminRoute>
          <DashboardLayout />
        </ProdectedAdminRoute>
      ),
      children: [
        { path: "/dashboard", element: <AdminDashboard /> },
        { path: "/manage-events", element: <ManageEvents /> },
        { path: "/security", element: <PasswordSettings /> },
        { path: "/manage-events", element: <ManageEvents /> },
        { path: "/profile", element: <UserProfile /> },
      ],
    },
  ]);
  return <RouterProvider router={routers} />;
}
