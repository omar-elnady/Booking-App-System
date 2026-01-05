import {
  Mail,
  Youtube,
  Copyright,
  Linkedin,
  LinkedinIcon,
  Facebook,
  Github,
  Phone,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-white dark:bg-black border-t border-border  pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 justify-between">
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-blue-700 dark:bg-blue-600">
              {t("footer.logo")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          <div className="md:col-span-1 space-y-4">
            <h4 className="text-lg font-semibold text-black dark:text-white">
              {t("footer.contactUs")}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center hover:scale-105 gap-3 duration-300 text-gray-800 dark:text-gray-200 group">
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400  transition-opacity" />
                <span className="text-sm  transition-all">
                  omarahmedelnadey@gmail.com
                </span>
              </li>
              <li className="flex items-center hover:scale-105 gap-3 duration-300 text-gray-800 dark:text-gray-200">
                <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-opacity" />
                <span className="text-sm  transition-all">
                  {t("footer.phone")}
                </span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1 space-y-4">
            <h4 className="text-lg font-semibold text-black dark:text-white">
              {t("footer.followUs")}
            </h4>
            <div className="flex gap-4">
              {[Facebook, Mail, Linkedin, Github].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 flex items-center justify-center text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black  transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm font-medium">
            <Copyright size={14} />
            <span>
              {new Date().getFullYear()} {t("footer.copyright")}
            </span>
          </div>

          <div className="flex gap-6 text-sm text-black dark:text-gray-400">
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t("footer.privacyPolicy")}
            </a>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t("footer.termsOfService")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
