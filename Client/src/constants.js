import { LogOut, LayoutDashboard } from "lucide-react";

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
export const getLoginForm = (t) => [
  {
    name: "email",
    label: t("login.email.label"),
    type: "email",
    placeholder: t("login.email.placeholder"),
    required: t("login.email.required"),
    pattern: {
      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: t("login.email.invalid"),
    },
  },
  {
    name: "password",
    label: t("login.password.label"),
    type: "password",
    placeholder: t("login.password.placeholder"),
    required: t("login.password.required"),
    minLength: {
      value: 8,
      message: t("login.password.minLength"),
    },
  },
];

export const loginDefult = {
  email: "",
  password: "",
};

export const getRegisterForm = (t) => [
  {
    name: "firstName",
    label: t("login.firstName.label"),
    type: "text",
    placeholder: t("login.firstName.placeholder"),
    required: t("login.firstName.required"),
  },
  {
    name: "lastName",
    label: t("login.lastName.label"),
    type: "text",
    placeholder: t("login.lastName.placeholder"),
    required: t("login.lastName.required"),
  },
  {
    name: "userName",
    label: t("login.userName.label"),
    type: "text",
    placeholder: t("login.userName.placeholder"),
    required: t("login.userName.required"),
  },
  ...getLoginForm(t),
  {
    name: "confirmPassword",
    label: t("login.confirmPassword.label"),
    type: "password",
    placeholder: t("login.confirmPassword.placeholder"),
    required: t("login.confirmPassword.required"),
    minLength: {
      value: 8,
      message: t("login.confirmPassword.minLength"),
    },
  },
];

export const registerDefult = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};