import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";
import { toast } from "sonner";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: dashboardService.getStats,
  });
};

export const useAdminCharts = () => {
  return useQuery({
    queryKey: ["admin", "charts"],
    queryFn: dashboardService.getCharts,
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: dashboardService.getUsers,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }) =>
      dashboardService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User role updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }) =>
      dashboardService.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User status updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });
};

export const useAdminEvents = () => {
  return useQuery({
    queryKey: ["admin", "events"],
    queryFn: dashboardService.getEvents,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => dashboardService.createEvent(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      toast.success("Event created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create event");
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, formData }) =>
      dashboardService.updateEvent({ eventId, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      toast.success("Event updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update event");
    },
  });
};

export const useUpdateEventStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, status }) =>
      dashboardService.updateEventStatus({ eventId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      toast.success("Event status updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId) => dashboardService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      toast.success("Event deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete event");
    },
  });
};

export const useAdminBookings = () => {
  return useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: dashboardService.getBookings,
  });
};

export const useAdminSettings = () => {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: dashboardService.getSettings,
    staleTime: 0,
    refetchOnMount: true,
    retry: 1, // Don't retry too many times if 403, just fail fast so fallback triggers if needed (though now it should be 200)
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings) => dashboardService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast.success("Settings updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update settings");
    },
  });
};

export const useOrganizerRequests = (options = {}) => {
  return useQuery({
    queryKey: ["admin", "organizer-requests"],
    queryFn: dashboardService.getOrganizerRequests,
    ...options,
  });
};

export const useHandleOrganizerRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }) =>
      dashboardService.handleOrganizerRequest({ userId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "organizer-requests"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] }); // Reload users to see role change
      toast.success("Request handled successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to handle request");
    },
  });
};

export const useCategoryRequests = (options = {}) => {
  return useQuery({
    queryKey: ["admin", "category-requests"],
    queryFn: dashboardService.getCategoryRequests,
    ...options,
  });
};

export const useHandleCategoryRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, status }) =>
      dashboardService.handleCategoryRequest({ categoryId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "category-requests"],
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // Reload categories list
      toast.success("Request handled successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to handle request");
    },
  });
};
