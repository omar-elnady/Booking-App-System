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

export const getListMenuAdmin = (t, logout) => [
  {
    name: t("navbar.dashboard"),
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  {
    name: t("navbar.logout"),
    onClick: () => logout(),
    icon: LogOut,
    to: "/login",
  },
];

export const getListMenuUser = (t, logout) => [
  {
    name: t("navbar.myBooking"),
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  {
    name: t("navbar.logout"),
    onClick: () => logout(),
    icon: LogOut,
    to: "/login",
  },
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
    pattern: {
      value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      message: t("login.password.invalid"),
    },
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
    name: "cPassword",
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
  cPassword: "",
};

export const singleLanguageEventForm = (lang, t) => {
  const languageSpecificFields = [
    {
      baseName: "eventName",
      type: "text",
    },
    {
      baseName: "eventDescription",
      type: "text",
    },
    {
      baseName: "eventVenue",
      type: "text",
    },
  ];

  const sharedFields = [
    {
      name: "eventCategory",
      type: "text",
    },
    {
      name: "eventDate",
      type: "date",
    },
    {
      name: "eventTime",
      type: "time",
    },
    {
      name: "eventCapacity",
      type: "number",
    },
  ];
  const langFields = languageSpecificFields.map((field) => ({
    name: `${field.baseName}${lang}`,
    label: t(`eventForm.${field.baseName}.label${lang}`),
    type: field.type,
    placeholder: t(`eventForm.${field.baseName}.placeholder${lang}`),
    required: t(`eventForm.${field.baseName}.required${lang}`),
  }));
  const sharedFieldsFormatted = sharedFields.map((field) => ({
    name: field.name,
    label: t(`eventForm.${field.name}.label${lang}`),
    type: field.type,
    placeholder: t(`eventForm.${field.name}.placeholder${lang}`),
    required: t(`eventForm.${field.name}.required${lang}`),
  }));
  return [...langFields, ...sharedFieldsFormatted];
};

export const bothLanguageEventForm = (lang, t) => {
  const languageSpecificFields = [
    {
      id: "eventNameEn",
      baseName: "eventName",
      type: "text",
      label: "labelEn",
      required: "requiredEn",
    },
    {
      id: "eventNameAr",
      baseName: "eventName",
      type: "text",
      label: "labelAr",
      required: "requiredAr",
      placeholder: "placeholderAr",
    },
    {
      id: "eventDescriptionEn",
      baseName: "eventDescription",
      type: "text",
      label: "labelEn",
      required: "requiredEn",
      placeholder: "placeholderEn",
    },
    {
      id: "eventDescriptionAr",
      baseName: "eventDescription",
      type: "text",
      label: "labelAr",
      required: "requiredAr",
      placeholder: "placeholderAr",
    },
    {
      id: "eventVenueEn",
      baseName: "eventVenue",
      type: "text",
      label: "labelEn",
      placeholder: "placeholderEn",
      required: "requiredEn",
    },
    {
      id: "eventVenueAr",
      baseName: "eventVenue",
      type: "text",
      label: "labelAr",
      required: "requiredAr",
      placeholder: "placeholderAr",
    },
  ];
  const sharedFields = [
    {
      id: "eventCategory",
      name: "eventCategory",
      type: "text",
    },
    {
      id: "eventDate",
      name: "eventDate",
      type: "date",
    },
    {
      id: "eventTime",
      name: "eventTime",
      type: "time",
    },
    {
      id: "eventCapacity",
      name: "eventCapacity",
      type: "number",
    },
  ];
  const langFields = languageSpecificFields.map((field) => ({
    name: field.baseName,
    id: field.id,
    label: t(`eventForm.${field.baseName}.${field.label}`),
    type: field.type,
    placeholder: t(`eventForm.${field.baseName}.${field.placeholder}`),
    required: t(`eventForm.${field.baseName}.${field.required}`),
  }));
  const sharedFieldsFormatted = sharedFields.map((field) => ({
    name: field.name,
    id: field.id,
    label: t(`eventForm.${field.name}.label${lang}`),
    type: field.type,
    placeholder: t(`eventForm.${field.name}.placeholder${lang}`),
    required: t(`eventForm.${field.name}.required${lang}`),
  }));
  return [...langFields, ...sharedFieldsFormatted];
};

export const addCategoryForm = (t) => [
  {
    name: "categoryEn",
    label: t("categoriesForm.labelEn"),
    type: "text",
    placeholder: t("categoriesForm.placeholderEn"),
    required: t("categoriesForm.requiredEn"),
  },
  {
    name: "categoryAr",
    label: t("categoriesForm.labelAr"),
    type: "text",
    placeholder: t("categoriesForm.placeholderAr"),
    required: t("categoriesForm.requiredAr"),
  },
];

export const userDataForm = (t) => [
  {
    name: "firstName",
    label: t("userForm.firstName"),
    type: "text",
  },
  {
    name: "lastName",
    label: t("userForm.lastName"),
    type: "text",
  },
  {
    name: "userName",
    label: t("userForm.userName"),
    type: "text",
  },
  {
    name: "email",
    label: t("userForm.email"),
    type: "email",
  },
  {
    name: "phone",
    label: t("userForm.phone"),
    type: "text",
  },


]

export const changePassword = (t , getValues) => [
  {
    name: "currentPassword",
    label: t("changePassword.currentPassword"),
    type: "password",
    required: t("changePassword.currentPasswordRequired"),
  },
  {
    name: "newPassword",
    label: t("changePassword.newPassword"),
    type: "password",
    required: t("login.password.required"),
    pattern: {
      value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      message: t("login.password.invalid"),
    },
    minLength: {
      value: 8,
      message: t("login.password.minLength"),
    },
  },
  {
    name: "confirmPassword",
    label: t("changePassword.confirmPassword"),
    type: "password",
    required: t("changePassword.confirmPasswordRequired"),
    validate: {
      matchesPreviousPassword: (value) => {
        const { newPassword } = getValues();
        return newPassword === value || t("changePassword.passwordsShouldMatch");
      }
    }
  },
]
