import React, { useState } from "react";
import { Menu, Bell, ChevronRight, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { DashboardSidebar } from "./DashboardSidebar";
import { UserNav } from "./UserNav";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function DashboardHeader({ isSidebarCollapsed, setIsSidebarCollapsed }) {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const location = useLocation();

  const pathsegments = location.pathname.split("/").filter(Boolean);

  return (
    <header className=" z-40  w-full rounded-t-2xl border-b border-border">
      <div className="flex h-16 items-center justify-between px-4 md:pe-8">
        <div className="flex items-center gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-primary/10 transition-colors"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">
                  {t("dashboard.sideBar.menuLabel")}
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side={isRtl ? "right" : "left"}
              className="p-0 border-none w-72 transition-transform duration-500"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>{t("dashboard.sideBar.menuLabel")}</SheetTitle>
              </SheetHeader>
              <DashboardSidebar onClose={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Desktop Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>

            <div className="h-4 w-[1px] bg-border hidden md:block" />

            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <span className="text-muted-foreground/60 hidden sm:block">
                {t("navbar.dashboard")}
              </span>
              {pathsegments.map((seg, i) => (
                <React.Fragment key={i}>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground/30",
                      isRtl && "rotate-180"
                    )}
                  />
                  <span
                    className={cn(
                      "capitalize",
                      i === pathsegments.length - 1
                        ? "text-primary font-semibold"
                        : "text-muted-foreground/60"
                    )}
                  >
                    {t(
                      `breadcrumbs.${seg.toLowerCase()}`,
                      seg.replace(/-/g, " ")
                    )}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ">
          <div className="flex items-center rounded-xl px-2 py-1 bg-muted/20 backdrop-blur-sm">
            <LanguageSwitcher />
            <div className="w-[1px] h-4 bg-border/50 mx-1" />
            <ThemeSwitcher />
          </div>

          <div className="w-[1px] h-6 bg-border/50 mx-2 hidden sm:block" />

          <UserNav />
        </div>
      </div>
    </header>
  );
}
