import apiClient from "@/lib/axios";

export const adminService = {
  getStats: async () => {
    const response = await apiClient.get("/admin/stats");
    return response.data;
  },

  getCharts: async () => {
    const response = await apiClient.get("/admin/charts");
    return response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get("/admin/users");
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await apiClient.patch(`/admin/users/${userId}/role`, {
      role,
    });
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await apiClient.patch(`/admin/users/${userId}/status`, {
      status,
    });
    return response.data;
  },

  getEvents: async () => {
    const response = await apiClient.get("/admin/events");
    return response.data;
  },

  createEvent: async (formData) => {
    const response = await apiClient.post("/admin/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateEvent: async ({ eventId, formData }) => {
    const response = await apiClient.put(`/admin/events/${eventId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateEventStatus: async ({ eventId, status }) => {
    const response = await apiClient.patch(`/admin/events/${eventId}/status`, {
      status,
    });
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await apiClient.delete(`/admin/events/${eventId}`);
    return response.data;
  },

  getBookings: async () => {
    const response = await apiClient.get("/admin/bookings");
    return response.data;
  },

  getSettings: async () => {
    const response = await apiClient.get("/admin/permissions");
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await apiClient.patch("/admin/permissions", settings);
    return response.data;
  },
};
