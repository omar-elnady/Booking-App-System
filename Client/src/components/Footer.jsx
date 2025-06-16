import {
  Mail,
  Youtube,
  Copyright,
  Linkedin,
  LinkedinIcon,
  Facebook,
  Github,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="dark:bg-darkMainBg bg-lightMainBg border-t border-gray-300 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-mainColor mb-2">
              {t("footer.logo")}
            </h3>
            <p className="text-gray-900 dark:text-textDark text-sm">
              {t("footer.description")}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg text-gray-900 dark:text-textDark font-semibold mb-3">
              {t("footer.contactUs")}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-900 dark:text-textDark">
                <Mail size={16} />
                <span className="text-sm">omarahmedelnadey@gmail.com</span>
              </div>
              <p className="text-gray-900 dark:text-textDark text-sm">
                {t("footer.phone")}
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg text-gray-900 dark:text-textDark font-semibold mb-3">
              {t("footer.followUs")}
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-900 dark:text-textDark hover:text-blue-400 transition-colors"
              >
                <Facebook size={22} />
              </a>
              <a
                href="#"
                className="text-gray-900 dark:text-textDark hover:text-blue-400 transition-colors"
              >
                <Mail size={22} />
              </a>
              <a
                href="#"
                className="text-gray-900 dark:text-textDark hover:text-blue-400 transition-colors"
              >
                <Linkedin size={22} />
              </a>
              <a
                href="#"
                className="text-gray-900 dark:text-textDark hover:text-blue-400 transition-colors"
              >
                <Github size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 mt-6">
          <div className="flex items-center justify-center gap-1 text-gray-700 dark:text-muted text-sm">
            <Copyright size={16} />
            <span>{t("footer.copyright")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
