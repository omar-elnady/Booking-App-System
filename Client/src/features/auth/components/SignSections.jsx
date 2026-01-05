import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ForgetYourPassword({ t }) {
  return (
    <Button
      variant="link"
      asChild
      className="px-0 font-normal h-auto text-primary"
    >
      <Link to="/forgot-password">{t("login.forgetPassword")}</Link>
    </Button>
  );
}

export function CreateYourAccount({ setIsLogin, t }) {
  return (
    <div className="text-sm text-muted-foreground">
      {t("login.dontHaveAccount")}{" "}
      <span
        onClick={() => setIsLogin(false)}
        className="text-primary hover:underline cursor-pointer font-medium"
        role="button"
        tabIndex={0}
      >
        {t("login.signUpHere")}
      </span>
    </div>
  );
}

export function YouAlreadyHaveAccount({ setIsLogin, t }) {
  return (
    <div className="text-sm text-muted-foreground">
      {t("login.alreadyHaveAccount")}{" "}
      <span
        onClick={() => setIsLogin(true)}
        className="text-primary hover:underline cursor-pointer font-medium"
        role="button"
        tabIndex={0}
      >
        {t("login.signInHere")}
      </span>
    </div>
  );
}
export function ContinueAsGuest({ t }) {
  return (
    <Button
      variant="link"
      asChild
      className="px-0 font-normal h-auto text-primary"
    >
      <Link to={"/"}>{t("login.continueAsGuest")}</Link>
    </Button>
  );
}

export function DemoAccounts({ t }) {
  return (
    <div className="mt-4 p-4 bg-muted/50 rounded-lg text-left w-full border border-border">
      <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
        {t("login.demoAccounts")}:
      </p>
      <div className="text-xs text-muted-foreground space-y-1 font-mono">
        <div className="flex justify-between">
          <span>Admin:</span>
          <span>admin@events.com / password</span>
        </div>
        <div className="flex justify-between">
          <span>User:</span>
          <span>user@demo.com / password</span>
        </div>
      </div>
    </div>
  );
}
