import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { toast } from "sonner";

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async ({ eventId }) => {
      const response = await apiClient.post("/booking/addBooking", { eventId });
      return response.data;
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to initiate booking"
      );
    },
  });
};
