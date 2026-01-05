import { useMutation } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";

export const useUpdateProfile = () => {
  const { updateUser } = useAuthStore();
  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (data) => {
      if (data.user) updateUser(data.user);
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};

export const useUpdateEmail = () => {
  return useMutation({
    mutationFn: userService.updateEmail,
    onSuccess: () => {
      toast.success("Verification code sent to new email.");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update email");
    },
  });
};

export const useVerifyEmailChange = () => {
  return useMutation({
    mutationFn: userService.verifyEmailChange,
    onSuccess: () => {
      toast.success("Email verified successfully! Please reload.");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Verification failed");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });
};

export const useToggle2FA = () => {
  return useMutation({
    mutationFn: userService.toggle2FA,
    onSuccess: (data, variables) => {
      toast.success(
        variables ? "2FA has been enabled" : "2FA has been disabled"
      );
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update 2FA settings"
      );
    },
  });
};

export const useDeleteAccount = () => {
  const { logout } = useAuthStore();
  return useMutation({
    mutationFn: userService.deleteAccount,
    onSuccess: () => {
      toast.success("Account deleted successfully");
      logout();
      window.location.href = "/login";
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete account");
    },
  });
};

export const useRequestOrganizer = () => {
  const { user, updateUser } = useAuthStore();
  return useMutation({
    mutationFn: userService.requestOrganizer,
    onSuccess: () => {
      toast.success("Request submitted successfully");
      updateUser({ ...user, organizerRequestStatus: "pending" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit request");
    },
  });
};
