import {
  LogOut,
  LayoutDashboard,
} from "lucide-react";

export const getBasicLinks = (t) => [
  {
    name: t("navbar.home"),
    to: "/",
  },
  {
    name: t("navbar.events"),
    to: "/events",
  },
];

export const getListMenuAdmin = (t) => [
  {
    name: t("navbar.dashboard"),
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  { name: t("navbar.logout"), icon: LogOut, to: "/sign-in" }, // Assuming logout redirects to sign-in
];

export const getLanguagesOptions = (t, changeLanguage) => [
  {
    label: t("navbar.en"),
    img: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg",
    value: "en",
    onClick: () => changeLanguage("en"),
  },
  {
    label: t("navbar.ar"),
    img: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg",
    value: "ar",
    onClick: () => changeLanguage("ar"),
  },
];

export const tooltipVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

