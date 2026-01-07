import apiClient from "@/lib/axios";

export const ticketsService = {
  // Get user bookings with optional filter
  getUserBookings: async (filter) => {
    const params = filter ? { filter } : {};
    const response = await apiClient.get("/user/bookings", { params });
    return response.data;
  },

  // Get next upcoming event
  getNextEvent: async () => {
    const response = await apiClient.get("/user/next-event");
    return response.data;
  },

  // Generate QR code for booking
  generateQRCode: async (bookingId) => {
    const response = await apiClient.get(`/user/bookings/${bookingId}/qr`);
    return response.data;
  },

  // Toggle wishlist
  toggleWishlist: async (eventId) => {
    const response = await apiClient.post(`/user/wishlist/${eventId}`);
    return response.data;
  },

  // Get wishlist
  getWishlist: async () => {
    const response = await apiClient.get("/user/wishlist");
    return response.data;
  },

  // Toggle follow organizer
  toggleFollow: async (organizerId) => {
    const response = await apiClient.post(`/user/follow/${organizerId}`);
    return response.data;
  },

  // Get following list
  getFollowing: async () => {
    const response = await apiClient.get("/user/following");
    return response.data;
  },

  verifySession: async (sessionId) => {
    const response = await apiClient.post("/booking/verify-session", {
      sessionId,
    });
    return response.data;
  },

  getBookingDetails: async (bookingId) => {
    const response = await apiClient.get(`/user/bookings/${bookingId}`);
    return response.data;
  },
};
