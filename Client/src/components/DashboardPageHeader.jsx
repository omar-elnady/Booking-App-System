import React from "react";

export const DashboardPageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
};
