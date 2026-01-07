import apiClient from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@features/auth/store/authStore";

export const useCancelTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId) => {
      const response = await apiClient.post("/booking/cancel", { eventId });
      return response.data;
    },
    onSuccess: (data, eventId) => {
      // Update local auth store to remove this event from bookedEvents
      const { user, updateUser } = useAuthStore.getState();
      if (user && user.bookedEvents) {
        const updatedBookedEvents = user.bookedEvents.filter(
          (id) => id.toString() !== eventId.toString()
        );
        updateUser({ bookedEvents: updatedBookedEvents });
      }

      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["next-event"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      toast.success(
        data.message ||
          "Ticket cancelled successfully. Refund will be processed shortly."
      );
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to cancel ticket. Please try again."
      );
    },
  });
};
