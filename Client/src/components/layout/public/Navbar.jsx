import React from "react";
import { getBasicLinks } from "@/config/constants";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import AuthSection from "@features/home/components/AuthSection";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  useTheme();
  const { t } = useLanguage();

  const basicLinks = getBasicLinks(t);
  const logoText = t("navbar.logoName");

  return (
    <nav className="bg-white dark:bg-black backdrop-blur-md shadow-md border-b border-gray-300 dark:border-gray-700 fixed top-5 w-[95%] max-w-7xl left-1/2 -translate-x-1/2 rounded-4xl z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo logoText={logoText} />
          <NavLinks links={basicLinks} />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <AuthSection />
            <MobileMenu links={basicLinks} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
