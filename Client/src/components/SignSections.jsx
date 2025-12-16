import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function ForgetYourPassword({ t }) {
  return (
    <Link to="/forget-password" className="text-mainColor hover:text-indigo-800 cursor-pointer">
      {t("login.forgetPassword")}
    </Link>
  );
}

export function CreateYourAccount({ setIsLogin, t }) {
  return (
    <p className="text-gray-600 dark:text-muted">
      {t("login.dontHaveAccount")}
      <span
        onClick={() => setIsLogin(false)}
        className="text-mainColor hover:text-indigo-800 font-medium cursor-pointer"
        aria-label="Sign up"
      >
        {t("login.signUpHere")}
      </span>
    </p>
  );
}

export function YouAlreadyHaveAccount({ setIsLogin, t }) {
  return (
    <p className="text-gray-600 dark:text-muted">
      {t("login.alreadyHaveAccount")}
      <span
        onClick={() => setIsLogin(true)}
        className="text-mainColor hover:text-indigo-800 font-medium cursor-pointer"
        aria-label="Sign in"
      >
        {t("login.signInHere")}
      </span>
    </p>
  );
}
export function ContinueAsGuest({ t }) {
  return (
    <Link
      to={"/"}
      className="text-mainColor hover:text-indigo-800 font-medium cursor-pointer"
    >
      {t("login.continueAsGuest")}
    </Link>
  );
}

export function DemoAccounts({ t }) {
  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t("login.demoAccounts")}:
      </p>
      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <p>
          <strong>Admin:</strong> admin@events.com / password
        </p>
        <p>
          <strong>User:</strong> user@demo.com / password
        </p>
      </div>
    </div>
  );
}
