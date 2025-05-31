import React from "react";
import { getBasicLinks } from "../../constants";
import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../hooks/useLanguage";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import AuthSection from "./AuthSection";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  useTheme();
  const { t } = useLanguage();

  const basicLinks = getBasicLinks(t);
  const logoText = t("navbar.logoName");

  return (
    <nav className="bg-lightMainBg/80 dark:bg-darkNavbar/80 backdrop-blur-md shadow-md border-b border-gray-300 dark:border-gray-700 fixed w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo logoText={logoText} />
          <NavLinks links={basicLinks} />
          <div className="flex items-center space-x-4">
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
