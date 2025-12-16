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
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
               {t("footer.logo")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
               {t("footer.description")}
            </p>
          </div>

          {/* Quick Links Column - Example structure if needed, or keeping it strictly contact/social for now to match current content */}
          {/* Contact Info */}
          <div className="md:col-span-1 space-y-4">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
              {t("footer.contactUs")}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400 group">
                <Mail className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm group-hover:text-slate-900 dark:group-hover:text-white transition-colors">omarahmedelnadey@gmail.com</span> 
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                 {/* Placeholder for phone if needed, utilizing existing t key */}
                 <span className="text-sm">{t("footer.phone")}</span>
              </li>
            </ul>
          </div>

          {/* Social Media - Now its own column or combined? Let's make it a column */}
          <div className="md:col-span-2 space-y-4">
             <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
              {t("footer.followUs")}
            </h4>
            <div className="flex gap-4">
              {[Facebook, Mail, Linkedin, Github].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
             <Copyright size={14} />
             <span>{new Date().getFullYear()} {t("footer.copyright")}</span>
           </div>
           
           {/* Privacy Links (Optional Placeholder) */}
           <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
