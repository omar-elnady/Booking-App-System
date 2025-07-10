// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
//    import Router Pages
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import { PasswordSettings } from "./pages/PasswordSettings";
import { UserProfile } from "./pages/UserProfile";
import DashboardLayout from "./Layouts/DashboardLayout";
import ManageEvents from "./pages/ManageEvents";
import { AuthProvider, useAuth } from "./context/UserContext";
import AuthLayout from "./Layouts/AuthLayout";
import { EventsProvider } from "./context/EventsContext";

export default function App() {
  function ProdectedAdminRoute({ children }) {
    // const { userData, isLogin } = useAuth();
    // console.log(userData, isLogin);
    // if (!isLogin || userData?.role !== "admin") {
    //   return <Navigate to="/" />;
    // }
    return children;
  }

  return (
    <EventsProvider>
      <AuthProvider>
        <Routes>
          {/* Main Layout Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:eventId" element={<EventDetails />} />
          </Route>

          {/* Admin Dashboard Routes (Protected) */}
          <Route
            path="/"
            element={
              <ProdectedAdminRoute>
                <DashboardLayout />
              </ProdectedAdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="manage-events" element={<ManageEvents />} />
            <Route path="security" element={<PasswordSettings />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* Auth Layout Routes */}
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
          </Route>

          {/* Catch-all route for 404 or redirect */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </AuthProvider>
    </EventsProvider>
  );
}
