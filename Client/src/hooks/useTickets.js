import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsService } from "@/services/ticketsService";
import { toast } from "sonner";
import { useAuthStore } from "@features/auth/store/authStore";

// Get user bookings
export const useUserBookings = (filter) => {
  return useQuery({
    queryKey: ["bookings", filter],
    queryFn: () => ticketsService.getUserBookings(filter),
  });
};

// Get next event
export const useNextEvent = () => {
  return useQuery({
    queryKey: ["next-event"],
    queryFn: ticketsService.getNextEvent,
  });
};

// Generate/Get QR Code
export const useGetQRCode = (bookingId, isOpen) => {
  return useQuery({
    queryKey: ["qr", bookingId],
    queryFn: () => ticketsService.generateQRCode(bookingId),
    enabled: !!bookingId && isOpen,
    retry: 1,
  });
};

// Toggle Wishlist - With Optimistic Update
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId) => {
      console.log("Toggle Wishlist Mutation called with ID:", eventId);
      return ticketsService.toggleWishlist(eventId);
    },
    onMutate: async (eventId) => {
      console.log("Adding to wishlist optimistically:", eventId);
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user"] });

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData(["user"]);

      // Get current user state from Zustand
      const { user } = useAuthStore.getState();
      console.log("Current Auth User:", user);

      // Optimistically update to the new value
      if (user) {
        const currentWishlist = user.wishlist || [];
        const isInWishlist = currentWishlist.includes(eventId);
        const newWishlist = isInWishlist
          ? currentWishlist.filter((id) => id !== eventId)
          : [...currentWishlist, eventId];

        useAuthStore.setState({
          user: { ...user, wishlist: newWishlist },
        });
      }

      return { previousUser, previousUserState: user };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err, newTodo, context) => {
      // Rollback to the previous value
      if (context?.previousUserState) {
        useAuthStore.setState({ user: context.previousUserState });
      }
      toast.error(err.response?.data?.message || "Failed to update wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// Get Wishlist
export const useWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: ticketsService.getWishlist,
  });
};

// Toggle Follow - With Optimistic Update
export const useToggleFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizerId) => ticketsService.toggleFollow(organizerId),
    onMutate: async (organizerId) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });
      const previousUser = queryClient.getQueryData(["user"]);

      const { user } = useAuthStore.getState();

      if (user) {
        const currentFollowing = user.following || [];
        const isFollowing = currentFollowing.some(
          (id) => id.toString() === organizerId.toString()
        );
        const newFollowing = isFollowing
          ? currentFollowing.filter(
              (id) => id.toString() !== organizerId.toString()
            )
          : [...currentFollowing, organizerId];

        useAuthStore.setState({
          user: { ...user, following: newFollowing },
        });
      }

      return { previousUser, previousUserState: user };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
    onError: (err, newTodo, context) => {
      if (context?.previousUserState) {
        useAuthStore.setState({ user: context.previousUserState });
      }
      toast.error(err.response?.data?.message || "Failed to update following");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// Get Following
export const useFollowing = () => {
  return useQuery({
    queryKey: ["following"],
    queryFn: ticketsService.getFollowing,
  });
};

// Get single booking details
export const useBookingDetails = (bookingId) => {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => ticketsService.getBookingDetails(bookingId),
    enabled: !!bookingId,
  });
};
