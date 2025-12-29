import {
  LayoutDashboard,
  Users,
  Calendar,
  Ticket,
  CreditCard,
  Settings,
  Shield,
  Layers,
  UserCircle,
  Lock,
} from "lucide-react";
import { ROLES } from "@/lib/roles";

export const getDashboardNavigation = (role) => {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return [
        {
          titleKey: "management.dashboard",
          items: [
            {
              titleKey: "management.dashboard",
              href: "/super-admin/dashboard",
              icon: LayoutDashboard,
            },
          ],
        },
        {
          titleKey: "management.overview",
          items: [
            {
              titleKey: "management.users",
              href: "/super-admin/users",
              icon: Users,
            },
            {
              titleKey: "management.events",
              href: "/super-admin/events",
              icon: Calendar,
            },
            {
              titleKey: "management.bookings",
              href: "/super-admin/bookings",
              icon: Ticket,
            },
            {
              titleKey: "management.categories",
              href: "/super-admin/categories",
              icon: Layers,
            },
          ],
        },
        {
          titleKey: "management.system",
          items: [
            {
              titleKey: "management.roles",
              href: "/super-admin/roles",
              icon: Shield,
            },
            {
              titleKey: "management.profile",
              href: "/super-admin/profile",
              icon: UserCircle,
            },
            {
              titleKey: "management.security",
              href: "/super-admin/security",
              icon: Lock,
            },
          ],
        },
      ];

    case ROLES.ADMIN:
      return [
        {
          titleKey: "management.dashboard",
          items: [
            {
              titleKey: "management.dashboard",
              href: "/admin/dashboard",
              icon: LayoutDashboard,
            },
          ],
        },
        {
          titleKey: "management.overview",
          items: [
            {
              titleKey: "management.events",
              href: "/admin/events",
              icon: Calendar,
            },
            {
              titleKey: "management.categories",
              href: "/admin/categories",
              icon: Layers,
            },
            {
              titleKey: "management.bookings",
              href: "/admin/bookings",
              icon: Ticket,
            },
            {
              titleKey: "management.users",
              href: "/admin/users",
              icon: Users,
            },
          ],
        },
        {
          titleKey: "management.system",
          items: [
            {
              titleKey: "management.roles",
              href: "/admin/roles",
              icon: Shield,
            },
            {
              titleKey: "management.profile",
              href: "/admin/profile",
              icon: UserCircle,
            },
            {
              titleKey: "management.security",
              href: "/admin/security",
              icon: Lock,
            },
          ],
        },
      ];

    case ROLES.ORGANIZER:
      return [
        {
          titleKey: "management.dashboard",
          items: [
            {
              titleKey: "management.dashboard",
              href: "/organizer/dashboard",
              icon: LayoutDashboard,
            },
          ],
        },
        {
          titleKey: "management.overview",
          items: [
            {
              titleKey: "management.events",
              href: "/organizer/events",
              icon: Calendar,
            },
            {
              titleKey: "management.categories",
              href: "/organizer/categories",
              icon: Layers,
            },
            {
              titleKey: "management.bookings",
              href: "/organizer/bookings",
              icon: Ticket,
            },
            {
              titleKey: "management.users",
              href: "/organizer/users",
              icon: Users,
            },
          ],
        },
        {
          titleKey: "management.system",
          items: [
            {
              titleKey: "management.roles",
              href: "/organizer/roles",
              icon: Shield,
            },
            {
              titleKey: "management.profile",
              href: "/organizer/profile",
              icon: UserCircle,
            },
            {
              titleKey: "management.security",
              href: "/organizer/security",
              icon: Lock,
            },
          ],
        },
      ];

    case ROLES.USER:
      return [
        {
          titleKey: "dashboard.sideBar.title",
          items: [
            {
              titleKey: "dashboard.sideBar.dashboard",
              href: "/user/dashboard",
              icon: LayoutDashboard,
            },
          ],
        },
        {
          titleKey: "navbar.bookings",
          items: [
            {
              titleKey: "navbar.bookings",
              href: "/user/bookings",
              icon: Ticket,
            },
            {
              titleKey: "userDashboard.eventsAttended",
              href: "/user/history",
              icon: Calendar,
            },
          ],
        },
        {
          titleKey: "dashboard.sideBar.profileSettings",
          items: [
            {
              titleKey: "userForm.title",
              href: "/user/profile",
              icon: UserCircle,
            },
            {
              titleKey: "changePassword.title",
              href: "/user/security",
              icon: Lock,
            },
          ],
        },
      ];

    default:
      return [];
  }
};
