import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { useAuthStore } from "@features/auth/store/authStore";
import { useEffect } from "react";

export const useUser = () => {
  const { isAuthenticated, updateUser, logout } = useAuthStore();

  const query = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await apiClient.get("/user/me");
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  useEffect(() => {
    if (query.data?.user) {
      // Prevent infinite loop: only update if data is different
      // utilizing a simple heuristic or assuming stable reference from query is not enough
      // because query.data is a new object from axios response
      const { user: currentUser } = useAuthStore.getState();

      // Smart comparison: Only update if the INCOMING data is different from what we have.
      // This ignores extra keys in currentUser that might have accumulated from merges.
      const isActuallyDifferent =
        !currentUser ||
        Object.keys(query.data.user).some((key) => {
          return (
            JSON.stringify(query.data.user[key]) !==
            JSON.stringify(currentUser[key])
          );
        });

      if (isActuallyDifferent) {
        updateUser(query.data.user);
      }
    }
  }, [query.data, updateUser]);

  // Handle unauthorized errors (stale tokens)
  useEffect(() => {
    if (query.error && query.error.response?.status === 401) {
      logout();
    }
  }, [query.error, logout]);

  return query;
};
