import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Download,
} from "lucide-react";
import {
  useUserTransactions,
  useTransactionStats,
} from "@/hooks/useTransactions";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Transactions() {
  const { t, i18n } = useTranslation();
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filters = {};
  if (typeFilter !== "all") filters.type = typeFilter;
  if (statusFilter !== "all") filters.status = statusFilter;

  const { data: transactionsData, isLoading } = useUserTransactions(filters);
  const { data: statsData } = useTransactionStats();

  const transactions = transactionsData?.transactions || [];
  const stats = statsData?.stats || {
    payments: { total: 0, totalAmount: 0, completed: 0 },
    refunds: { total: 0, totalAmount: 0, completed: 0 },
  };

  const getLocalized = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[i18n.language] || field.en || "";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "pending":
        return <Clock className="h-3.5 w-3.5" />;
      case "failed":
      case "cancelled":
        return <XCircle className="h-3.5 w-3.5" />;
      default:
        return <Clock className="h-3.5 w-3.5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30";
      case "failed":
      case "cancelled":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30";
      default:
        return "text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-950/30";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-1 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-8 border-b border-neutral-200 dark:border-neutral-800 pb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-primary rounded-full" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">
                  {t("transactions.tag") || "Financial History"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight lowercase first-letter:uppercase">
                {t("transactions.title") || "Transactions"}
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-xl text-lg font-normal leading-relaxed mt-2">
                {t("transactions.subtitle") ||
                  "Track all your payments and refunds in one place."}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl px-6 py-2 shadow-sm flex items-center gap-6">
                <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                  <ArrowUpRight className="h-7 w-7 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">
                    {t("transactions.payments") || "Payments"}
                  </p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-white leading-none">
                    {stats.payments.completed || stats.payments.total || 0}
                  </p>
                </div>
              </div>

              <div className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm flex items-center gap-6">
                <div className="w-10 h-10 rounded-2xl bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                  <ArrowDownLeft className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">
                    {t("transactions.refunds") || "Refunds"}
                  </p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-white leading-none">
                    {stats.refunds.completed || stats.refunds.total || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-500">
              <Filter className="h-4 w-4" />
              {t("common.filters") || "Filters"}:
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px] h-11 rounded-xl font-bold border-border/60">
                <SelectValue placeholder={t("transactions.type") || "Type"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="font-bold">
                  {t("common.all") || "All Types"}
                </SelectItem>
                <SelectItem value="payment" className="font-bold">
                  {t("transactions.payment") || "Payments"}
                </SelectItem>
                <SelectItem value="refund" className="font-bold">
                  {t("transactions.refund") || "Refunds"}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] h-11 rounded-xl font-bold border-border/60">
                <SelectValue
                  placeholder={t("transactions.status") || "Status"}
                />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="font-bold">
                  {t("common.all") || "All Status"}
                </SelectItem>
                <SelectItem value="completed" className="font-bold">
                  {t("dashboard.status.completed") || "Completed"}
                </SelectItem>
                <SelectItem value="pending" className="font-bold">
                  {t("dashboard.status.pending") || "Pending"}
                </SelectItem>
                <SelectItem value="failed" className="font-bold">
                  {t("dashboard.status.failed") || "Failed"}
                </SelectItem>
              </SelectContent>
            </Select>

            {(typeFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTypeFilter("all");
                  setStatusFilter("all");
                }}
                className="h-11 rounded-xl font-bold"
              >
                {t("common.clearFilters") || "Clear"}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Transactions List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
            <p className="text-neutral-400 font-medium text-xs uppercase tracking-[0.2em] animate-pulse">
              {t("common.loading") || "Loading..."}
            </p>
          </div>
        ) : transactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center max-w-md w-full p-12 rounded-[3rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-300">
                <Receipt className="h-12 w-12" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {t("transactions.empty") || "No Transactions"}
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed">
                  {t("transactions.emptyDesc") ||
                    "Your transaction history will appear here once you make your first booking."}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                >
                  <Card className="group bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 hover:border-primary/20 transition-all duration-500 rounded-[2rem] shadow-sm hover:shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        {/* Left: Transaction Info */}
                        <div className="flex items-start gap-4 flex-1">
                          {/* Icon */}
                          <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                              transaction.type === "payment"
                                ? "bg-red-100 dark:bg-red-950/30"
                                : "bg-green-100 dark:bg-green-950/30"
                            }`}
                          >
                            {transaction.type === "payment" ? (
                              <ArrowUpRight className="h-6 w-6 text-red-600 dark:text-red-400" />
                            ) : (
                              <ArrowDownLeft className="h-6 w-6 text-green-600 dark:text-green-400" />
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white line-clamp-1">
                                  {transaction.description ||
                                    getLocalized(transaction.event?.name) ||
                                    (transaction.type === "payment"
                                      ? "Payment"
                                      : "Refund")}
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(
                                      transaction.createdAt
                                    ).toLocaleDateString(i18n.language, {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </div>
                                  {transaction.stripeSessionId && (
                                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                      <CreditCard className="h-3.5 w-3.5" />
                                      {transaction.stripeSessionId.slice(-8)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(
                                transaction.status
                              )}`}
                            >
                              {getStatusIcon(transaction.status)}
                              {t(`dashboard.status.${transaction.status}`) ||
                                transaction.status}
                            </div>
                          </div>
                        </div>

                        {/* Right: Amount */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                              {transaction.type === "refund" && "+"}
                              {transaction.amount.toLocaleString()}{" "}
                              <span className="text-sm font-semibold text-neutral-500">
                                {transaction.currency}
                              </span>
                            </p>
                            <p className="text-xs font-medium text-neutral-400">
                              {transaction.type === "payment"
                                ? transaction.status === "completed"
                                  ? t("transactions.paid")
                                  : t("dashboard.status.pending")
                                : transaction.status === "completed"
                                ? t("transactions.refunded")
                                : t("dashboard.status.pending")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
