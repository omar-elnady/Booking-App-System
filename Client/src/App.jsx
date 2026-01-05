import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "sonner";

// Shared & App
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import { ThemeProvider } from "@app/providers/ThemeContext";
import ComingSoon from "@/pages/ComingSoon";
import { ROLES, getDashboardRoute } from "@/lib/roles";

// Dashboard Components
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAdminSettings } from "@/hooks/useAdmin";

// Dashboard Pages (role-specific)
import AdminDashboard from "@/pages/dashboard/AdminDashboard"; // For super-admin & admin
import OrganizerDashboard from "@/pages/dashboard/OrganizerDashboard";
import UserDashboard from "@/pages/dashboard/UserDashboard";

// Public Features
import Home from "@/pages/home/Home";
import Events from "@/pages/events/Events";
import EventDetails from "@/pages/events/EventDetails";
import TicketConfirmation from "@/pages/bookings/TicketConfirmation";
import TicketCancelled from "@/pages/bookings/TicketCancelled";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";

// Shared Dashboard Pages (accessible based on permissions)
import ManageAllUsers from "@/pages/dashboard/ManageAllUsers";
import ManageAllEvents from "@/pages/dashboard/ManageAllEvents";
import ManageAllBookings from "@/pages/dashboard/ManageAllBookings";
import RolesPermissions from "@/pages/dashboard/RolesPermissions";
import ManageCategories from "@/pages/dashboard/ManageCategories";
import { UserProfile } from "@/pages/dashboard/UserProfile";

import { useAuthStore } from "@features/auth/store/authStore";

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const direction = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = direction;
    document.body.dir = direction;
  }, [i18n, i18n.language]);

  // Protected Route Component
  function ProtectedRoute({ children, allowedRoles = [] }) {
    const { isAuthenticated, role } = useAuthStore();

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(role?.toLowerCase())
    ) {
      return <Navigate to={getDashboardRoute(role?.toLowerCase())} replace />;
    }

    return children;
  }

  // Permission Guard Component
  function PermissionGuard({ children, permission }) {
    const { role } = useAuthStore();
    const { data: settingsData } = useAdminSettings();

    if (settingsData?.settings?.rolePermissions) {
      const normalizedRole = role?.toLowerCase();
      const perms = settingsData.settings.rolePermissions[normalizedRole];
      // If permissions exist (array) and the required one is missing, block access
      if (perms && Array.isArray(perms) && !perms.includes(permission)) {
        return <Navigate to={getDashboardRoute(normalizedRole)} replace />;
      }
    }
    return children;
  }

  return (
    <ThemeProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="ticket-confirmation" element={<TicketConfirmation />} />
          <Route path="ticket-cancelled" element={<TicketCancelled />} />
        </Route>

        {/* Super Admin Routes */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="/super-admin/dashboard" replace />}
          />
          <Route
            path="dashboard"
            element={
              <PermissionGuard permission="/dashboard">
                <AdminDashboard />
              </PermissionGuard>
            }
          />
          <Route
            path="users"
            element={
              <PermissionGuard permission="/users">
                <ManageAllUsers />
              </PermissionGuard>
            }
          />
          <Route
            path="events"
            element={
              <PermissionGuard permission="/events">
                <ManageAllEvents />
              </PermissionGuard>
            }
          />
          <Route
            path="bookings"
            element={
              <PermissionGuard permission="/bookings">
                <ManageAllBookings />
              </PermissionGuard>
            }
          />
          <Route
            path="categories"
            element={
              <PermissionGuard permission="/categories">
                <ManageCategories />
              </PermissionGuard>
            }
          />
          <Route
            path="roles"
            element={
              <PermissionGuard permission="/roles">
                <RolesPermissions />
              </PermissionGuard>
            }
          />
          <Route
            path="profile"
            element={
              <PermissionGuard permission="/profile">
                <UserProfile />
              </PermissionGuard>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <PermissionGuard permission="/dashboard">
                <AdminDashboard />
              </PermissionGuard>
            }
          />
          <Route
            path="events"
            element={
              <PermissionGuard permission="/events">
                <ManageAllEvents />
              </PermissionGuard>
            }
          />
          <Route
            path="bookings"
            element={
              <PermissionGuard permission="/bookings">
                <ManageAllBookings />
              </PermissionGuard>
            }
          />
          <Route
            path="users"
            element={
              <PermissionGuard permission="/users">
                <ManageAllUsers />
              </PermissionGuard>
            }
          />
          <Route
            path="categories"
            element={
              <PermissionGuard permission="/categories">
                <ManageCategories />
              </PermissionGuard>
            }
          />

          <Route
            path="profile"
            element={
              <PermissionGuard permission="/profile">
                <UserProfile />
              </PermissionGuard>
            }
          />
        </Route>

        {/* Organizer Routes */}
        <Route
          path="/organizer"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.ORGANIZER]}
            >
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="/organizer/dashboard" replace />}
          />
          <Route
            path="dashboard"
            element={
              <PermissionGuard permission="/dashboard">
                <OrganizerDashboard />
              </PermissionGuard>
            }
          />
          <Route
            path="events"
            element={
              <PermissionGuard permission="/events">
                <ManageAllEvents />
              </PermissionGuard>
            }
          />
          <Route
            path="bookings"
            element={
              <PermissionGuard permission="/bookings">
                <ManageAllBookings />
              </PermissionGuard>
            }
          />
          <Route
            path="categories"
            element={
              <PermissionGuard permission="/categories">
                <ManageCategories />
              </PermissionGuard>
            }
          />
          <Route
            path="users"
            element={
              <PermissionGuard permission="/users">
                <ManageAllUsers />
              </PermissionGuard>
            }
          />

          <Route path="revenue" element={<ComingSoon />} />
          <Route path="analytics" element={<ComingSoon />} />
          <Route
            path="profile"
            element={
              <PermissionGuard permission="/profile">
                <UserProfile />
              </PermissionGuard>
            }
          />
        </Route>

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.SUPER_ADMIN,
                ROLES.ADMIN,
                ROLES.ORGANIZER,
                ROLES.USER,
              ]}
            >
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <PermissionGuard permission="/dashboard">
                <UserDashboard />
              </PermissionGuard>
            }
          />
          <Route
            path="bookings"
            element={
              <PermissionGuard permission="/bookings">
                <ComingSoon />
              </PermissionGuard>
            }
          />
          <Route
            path="history"
            element={
              <PermissionGuard permission="/history">
                <ComingSoon />
              </PermissionGuard>
            }
          />
          <Route path="upcoming" element={<ComingSoon />} />
          <Route
            path="profile"
            element={
              <PermissionGuard permission="/profile">
                <UserProfile />
              </PermissionGuard>
            }
          />
        </Route>

        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Login />} />
          <Route path="signup" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster richColors />
    </ThemeProvider>
  );
}
