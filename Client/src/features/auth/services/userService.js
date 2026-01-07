import apiClient from "@/lib/axios";

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get("/user/me");
    return response.data;
  },

  updateProfile: async (formData) => {
    const response = await apiClient.put("/user/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateEmail: async (data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    const response = await apiClient.put("/user/profile", formData);
    return response.data;
  },

  verifyEmailChange: async (code) => {
    const response = await apiClient.post("/user/verify-email-change", {
      code,
    });
    return response.data;
  },

  toggle2FA: async (data) => {
    // Check if data is just a boolean (backward compatibility) or object
    const payload = typeof data === "object" ? data : { enable: data };
    const response = await apiClient.patch("/user/2fa", payload);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await apiClient.patch("/auth/changePassword", data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient.delete("/user");
    return response.data;
  },

  requestOrganizer: async () => {
    const response = await apiClient.post("/user/request-organizer");
    return response.data;
  },
};
