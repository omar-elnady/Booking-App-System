import React from "react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

const EmptyState = ({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There are no results available at this time.",
  action,
  className,
  iconClassName,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-[50vh] text-center p-8 animate-in fade-in zoom-in duration-300 mx-auto max-w-2xl",
        className
      )}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150" />
        <div className="relative p-6 bg-muted/20 rounded-full border border-border/40 shadow-inner">
          <Icon
            className={cn(
              "h-10 w-10 text-muted-foreground/30 stroke-[1.5]",
              iconClassName
            )}
          />
        </div>
      </div>

      <h3 className="font-bold text-xl tracking-tight text-foreground/90">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-[280px] mx-auto font-medium leading-relaxed mt-2">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
