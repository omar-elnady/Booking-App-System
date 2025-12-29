import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { toast } from "sonner";

// Fetch Categories
export const useCategories = (search = "") => {
  return useQuery({
    queryKey: ["categories", { search }],
    queryFn: async () => {
      const response = await apiClient.get("/categories", {
        params: { search },
      });
      return response.data; // { categories: [], count: N, message: ... }
    },
  });
};

// Create Category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      console.log("Creating category with data:", data);
      const response = await apiClient.post("/categories/create", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("Category created successfully");
    },
    onError: (error) => {
      console.error("Category creation error:", error);
      console.error("Error response:", error.response);

      const errorMessage =
        error.response?.data?.validationErrors?.[0]?.message ||
        error.response?.data?.message ||
        "Failed to create category";

      toast.error(errorMessage);
    },
  });
};

// Update Category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.patch(`/categories/update/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update category");
    },
  });
};

// Delete Category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`/categories/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });
};
