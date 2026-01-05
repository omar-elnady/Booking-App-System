import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} DropdownItem
 * @property {string} [type] - 'item' | 'label' | 'separator' | 'custom'
 * @property {string|React.ReactNode} [label] - Label text or node
 * @property {React.ComponentType} [icon] - Icon component
 * @property {Function} [onClick] - Click handler
 * @property {string} [className] - Additional class names
 * @property {string} [color] - Text color class
 * @property {boolean} [disabled] - Disabled state
 * @property {boolean} [fill] - Icon fill style
 */

/**
 * Custom Dropdown Component
 * @param {Object} props
 * @param {React.ReactNode} props.trigger - The trigger element
 * @param {DropdownItem[]} props.items - Array of items to render
 * @param {string} [props.align] - Alignment of the dropdown
 * @param {string} [props.className] - Content class name
 */
const ActionMenu = ({ trigger, items = [], align = "end", className }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="outline-none">
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn(
          "w-56 rounded-xl shadow-xl border-border/60 p-1.5 font-medium animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        {items.map((item, index) => {
          if (item.type === "separator") {
            return (
              <DropdownMenuSeparator
                key={index}
                className="bg-border/50 my-1"
              />
            );
          }

          if (item.type === "label") {
            return (
              <DropdownMenuLabel
                key={index}
                className={cn(
                  "px-2 py-1.5 text-xs font-black uppercase tracking-widest text-muted-foreground/50",
                  item.className
                )}
              >
                {item.label}
              </DropdownMenuLabel>
            );
          }

          if (item.type === "custom") {
            return (
              <div key={index} className={item.className}>
                {item.content}
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={index}
              onClick={item.onClick}
              disabled={item.disabled}
              className={cn(
                "rounded-lg gap-2 cursor-pointer focus:bg-accent transition-colors my-0.5",
                item.color,
                item.className
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "h-4 w-4 opacity-70",
                    item.color,
                    item.fill && "fill-current/20 opacity-100"
                  )}
                />
              )}
              <span className="flex-1 truncate">{item.label}</span>
              {item.rightContent}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionMenu;
