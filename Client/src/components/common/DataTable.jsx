import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

/**
 * Reusable DataTable component
 * @param {Object[]} columns - Array of column definitions: { key, label, render: (item) => ReactNode, className }
 * @param {Object[]} data - Array of data objects
 * @param {boolean} isLoading - Loading state
 * @param {string} emptyMessage - Message to show when data is empty
 * @param {Function} onRowClick - (item) => void Handler for row click
 */
const DataTable = ({
  columns,
  data,
  isLoading,
  emptyMessage = "No data available",
  onRowClick,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-10 border border-border/40 rounded-xl bg-card">
        <Activity className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="border border-border/40 rounded-xl bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-border/40">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn("font-bold text-foreground/80", col.className)}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length > 0 ? (
            data.map((item, rowIndex) => (
              <TableRow
                key={item._id || rowIndex} // Prefer _id if available
                className={cn(
                  "hover:bg-muted/10 transition-colors border-border/40",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((col) => (
                  <TableCell key={`${item._id || rowIndex}-${col.key}`}>
                    {col.render ? col.render(item) : item[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-10 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
