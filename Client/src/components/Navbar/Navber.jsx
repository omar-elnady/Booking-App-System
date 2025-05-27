// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   User,
//   LogOut,
//   Settings,
//   Search,
//   CalendarCheck,
//   LayoutDashboard,
//   MousePointerClick,
//   Menu,
//   Sun,
//   Moon,
//   MoonIcon,
//   UserPlusIcon,
//   UserPlus,
// } from "lucide-react";
// import Button from "../Button";
// import DropdownMenu from "../DropdownMenu";
// import { useTranslation } from "react-i18next";
// import CustomDropdown from "../Combox";
// import { AnimatePresence, motion } from "framer-motion";

// const Navbar = () => {
//   const { t, i18n } = useTranslation();
//   const isAuthenticated = false;
//   const user = { role: "admin", name: "omar" };
//   const navigate = useNavigate();

//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng);
//   };
//   const languagesOpition = [
//     {
//       label: t("navbar.en"),
//       img: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg",
//       value: "en",
//       onClick: () => {
//         changeLanguage("en");
//       },
//     },
//     {
//       label: t("navbar.ar"),
//       img: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg",
//       value: "ar",
//       onClick: () => {
//         changeLanguage("ar");
//       },
//     },
//   ];
//   const [lang, setLang] = useState(
//     i18n.language
//       ? i18n.language == "en"
//         ? languagesOpition[0]
//         : languagesOpition[1]
//       : languagesOpition[0]
//   );
//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     if (isDark) {
//       document.documentElement.classList.toggle("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [isDark]);

//   const toggleTheme = () => {
//     setIsDark(!isDark);
//   };

//   const basicLinks = [
//     {
//       name: t("navbar.home"),
//       to: "/",
//     },
//     {
//       name: t("navbar.events"),
//       to: "/events",
//     },
//   ];

//   const listMenuAdmin = [
//     {
//       name: t("navbar.dashboard"),
//       icon: LayoutDashboard,
//       to: "/dashboard",
//     },
//     { name: t("navbar.logout"), icon: LogOut, to: "/sign-in" },
//   ];
//   const tooltipVariants = {
//     hidden: { opacity: 0, y: -10 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.2, ease: "easeOut" },
//     },
//   };

//   return (
//     <nav className="bg-white blurred dark:bg-darkNavbar   shadow-lg border-b  transition-colors duration-500 border-gray-600 z-50">
//       <div className="container mx-auto ">
//         <div className="flex justify-between items-center h-16">
//           <Link to="/" className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-lg">
//                 <MousePointerClick />
//               </span>
//             </div>
//             <span className="text-xl font-bold text-gray-900 dark:text-white transition duration-500">
//               {t("navbar.logoName")}
//             </span>
//           </Link>

//           {/* Basic Links */}
//           <div className="hidden md:flex items-center space-x-8">
//             {basicLinks.map((link, index) => (
//               <Link
//                 key={index}
//                 to={link.to}
//                 className="text-gray-700 dark:text-white hover:text-indigo-600 transition-colors duration-400 font-medium"
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </div>

//           {/* Start Language Switcher */}
//           <div className="flex items-center space-x-4">
//             <div
//               className={` items-center space-x-2 ${
//                 i18n.language === "en"
//                   ? "border-r pr-4 mr-4"
//                   : "border-l pl-4 ml-4"
//               } border-gray-300 `}
//             >
//               <CustomDropdown
//                 value={lang}
//                 options={languagesOpition}
//                 setValue={setLang}
//               />
//             </div>
//             {/* End Language Switcher */}
//             {/* Start Mode Switcher */}
//             <div>
//               <div
//                 className=" hidden md:block relative w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded-full p-1 cursor-pointer"
//                 onClick={toggleTheme}
//               >
//                 <div
//                   className={`w-6 h-6 bg-white rounded-full flex items-center justify-center transform transition-transform duration-300 ${
//                     i18n.language === "ar"
//                       ? isDark
//                         ? "-translate-x-8"
//                         : "-translate-x-0"
//                       : isDark
//                       ? "translate-x-0"
//                       : "translate-x-8"
//                   }`}
//                 >
//                   {isDark ? (
//                     <Moon className="text-gray-300 w-4 h-4" />
//                   ) : (
//                     <Sun className="text-yellow-500 w-4 h-4" />
//                   )}
//                 </div>
//               </div>
//               <div
//                 className=" block md:hidden relative  rounded-full p-1 cursor-pointer"
//                 onClick={toggleTheme}
//               >
//                 {isDark ? (
//                   <Moon className="text-gray-300 w-6 h-6" />
//                 ) : (
//                   <Sun className="text-yellow-500 w-6 h-6" />
//                 )}
//               </div>
//             </div>

//             {/* End Mode Switcher */}
//             {/* Start User Menu  */}
//             {isAuthenticated ? (
//               <div className="flex items-center space-x-3">
//                 {user?.role && (
//                   <DropdownMenu
//                     items={listMenuAdmin}
//                     menuName={
//                       <div className="flex items-center gap-1">
//                         <User /> {user.name.toLocaleUpperCase()}
//                       </div>
//                     }
//                     classMenuBtn={`border-none hidden md:inline-flex`}
//                   />
//                 )}
//               </div>
//             ) : (
//               <div className="">
//                 <div className="hidden md:flex items-center space-x-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className=""
//                     onClick={() => navigate("/login")}
//                   >
//                     {t("navbar.login")}
//                   </Button>
//                   <Button
//                     size="sm"
//                     onClick={() => navigate("/register")}
//                     className=" text-white"
//                   >
//                     {t("navbar.signup")}
//                   </Button>
//                 </div>
//                 <div className="relative group">
//                   <UserPlus className="h-6 w-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200" />
//                   <AnimatePresence>
//                     <motion.div
//                       className=" absolute top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1 text-sm text-gray-700 dark:text-cardForeground shadow-md backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 hidden group-hover:block"
//                       variants={tooltipVariants}
//                       initial="hidden"
//                       animate="visible"
//                       exit="hidden"
//                     >
//                       {t("navbar.login")}
//                     </motion.div>
//                   </AnimatePresence>
//                 </div>
//               </div>
//             )}
//             <DropdownMenu
//               items={basicLinks}
//               cancelDefultStyle={true}
//               menuName={<Menu className="dark:text-white" />}
//               classMenuBtn={`md:hidden px-1 py-2 rounded  shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600`}
//             />
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getBasicLinks } from '../../constants'; // Corrected path
import { useTheme } from '../../hooks/useTheme'; // Corrected path
import { useLanguage } from '../../hooks/useLanguage'; // Corrected path
import Logo from './Logo';
import NavLinks from './NavLinks';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import AuthSection from './AuthSection';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  // Initialize hooks
  useTheme(); // Manages theme state and applies dark class
  const { t } = useLanguage(); // Provides translation function and manages language state

  // Get data from constants (passing t for translation)
  const basicLinks = getBasicLinks(t);
  const logoText = t('navbar.logoName');

  return (
    <nav className="bg-white blurred dark:bg-darkNavbar shadow-lg border-b  border-gray-600 dark:border-gray-700 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Logo logoText={logoText} />

          {/* Desktop Navigation Links */}
          <NavLinks links={basicLinks} />

          {/* Right Section: Language, Theme, Auth, Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher (Desktop) */}
            <LanguageSwitcher />

            {/* Theme Switcher (Desktop + Mobile Icon) */}
            <ThemeSwitcher />

            {/* Authentication Section (Desktop Buttons + Mobile Icon) */}
            {/* Note: AuthSection handles logic for authenticated/unauthenticated states */}
            <AuthSection />

            {/* Mobile Menu Trigger */}
            {/* Pass basic links; you might want to combine auth links here too */}
            <MobileMenu links={basicLinks} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

