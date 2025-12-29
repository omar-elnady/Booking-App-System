import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  return (
    <Button
      onClick={() => navigate(-1)}
      className="mb-6 flex items-center space-x-2 "
    >
      {i18n.language === "en" ? (
        <ArrowLeft className="w-4 h-4" />
      ) : (
        <ArrowLeft className="rotate-180 w-4 h-4" />
      )}
      <span>{t("eventDetails.back")}</span>
    </Button>
  );
}

export default Header;
