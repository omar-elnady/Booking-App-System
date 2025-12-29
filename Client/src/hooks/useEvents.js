import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { toast } from "sonner";

// Fetch Events with Pagination & Search
export const useEvents = ({
  page = 1,
  size = 9,
  search = "",
  categories = [],
  sortBy = "",
} = {}) => {
  return useQuery({
    queryKey: ["events", { page, size, search, categories, sortBy }],
    queryFn: async () => {
      const response = await apiClient.get("/event", {
        params: { page, size, search, categories, sortBy },
      });
      return response.data;
    },
    placeholderData: keepPreviousData, // Keep data while fetching new page
  });
};

// Fetch Single Event
export const useEvent = (id) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await apiClient.get(`/event/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create Event
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      // formData should be FormData object for file upload
      const response = await apiClient.post("/event/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      toast.success("Event created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create event");
    },
  });
};

// Update Event
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.patch(`/event/update/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["events"]);
      queryClient.invalidateQueries(["event", id]);
      toast.success("Event updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update event");
    },
  });
};

// Delete Event
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/event/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      toast.success("Event deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete event");
    },
  });
};
