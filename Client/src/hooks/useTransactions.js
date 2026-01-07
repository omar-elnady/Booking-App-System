import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

// Transaction Service
const transactionService = {
  getUserTransactions: async (params = {}) => {
    const response = await apiClient.get("/user/transactions", { params });
    return response.data;
  },

  getTransactionById: async (transactionId) => {
    const response = await apiClient.get(`/user/transactions/${transactionId}`);
    return response.data;
  },

  getTransactionStats: async () => {
    const response = await apiClient.get("/user/transactions/stats");
    return response.data;
  },
};

// Get user transactions with filters
export const useUserTransactions = (filters = {}) => {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => transactionService.getUserTransactions(filters),
  });
};

// Get transaction by ID
export const useTransaction = (transactionId) => {
  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => transactionService.getTransactionById(transactionId),
    enabled: !!transactionId,
  });
};

// Get transaction statistics
export const useTransactionStats = () => {
  return useQuery({
    queryKey: ["transaction-stats"],
    queryFn: transactionService.getTransactionStats,
  });
};
