import { asyncHandler } from "../../../utils/errorHandling.js";
import bookingModel from "../../../DB/modules/Booking.model.js";
import userModel from "../../../DB/modules/User.model.js";
import eventModel from "../../../DB/modules/Event.model.js";
import { nanoid } from "nanoid";

// Get User's Bookings (Tickets) with filtering
export const getUserBookings = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { filter } = req.query; // 'upcoming', 'past', 'cancelled'

  const now = new Date();
  let query = { user: id };

  // Apply filters
  if (filter === "upcoming") {
    query.status = "booked";
    // We'll filter by event date in aggregation
  } else if (filter === "past") {
    query.status = "booked";
  } else if (filter === "cancelled") {
    query.status = "cancelled";
  }

  const bookings = await bookingModel
    .find(query)
    .populate({
      path: "event",
      select:
        "name description venue date price image capacity availableTickets status",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .sort({ bookingDate: -1 });

  // Filter by event date for upcoming/past
  let filteredBookings = bookings;
  if (filter === "upcoming") {
    filteredBookings = bookings.filter(
      (b) => b.event && new Date(b.event.date) >= now
    );
  } else if (filter === "past") {
    filteredBookings = bookings.filter(
      (b) => b.event && new Date(b.event.date) < now
    );
  }

  return res.status(200).json({
    message: "Bookings fetched successfully",
    bookings: filteredBookings,
  });
});

// Get Next Upcoming Event
export const getNextEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const now = new Date();

  const booking = await bookingModel
    .findOne({
      user: id,
      status: "booked",
    })
    .populate({
      path: "event",
      select: "name description venue date price image capacity status",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .sort({ "event.date": 1 });

  // Filter to get only future events
  if (booking && booking.event && new Date(booking.event.date) >= now) {
    return res.status(200).json({
      message: "Next event fetched successfully",
      booking,
    });
  }

  return res.status(200).json({
    message: "No upcoming events",
    booking: null,
  });
});

// Toggle Wishlist (Add/Remove Event)
export const toggleWishlist = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { eventId } = req.params;

  console.log(`[Toggle Wishlist] User: ${id}, Event: ${eventId}`);

  // Check if event exists
  const event = await eventModel.findById(eventId);
  if (!event) {
    return next(new Error("Event not found", { cause: 404 }));
  }

  const user = await userModel.findById(id);
  const isInWishlist = user.wishlist.some((id) => id.toString() === eventId);

  let updatedUser;

  if (isInWishlist) {
    // Remove from wishlist
    console.log("Removing event from wishlist (Atomic)...");
    updatedUser = await userModel.findByIdAndUpdate(
      id,
      { $pull: { wishlist: eventId } },
      { new: true }
    );
  } else {
    // Add to wishlist
    console.log("Adding event to wishlist (Atomic)...");
    updatedUser = await userModel.findByIdAndUpdate(
      id,
      { $addToSet: { wishlist: eventId } },
      { new: true }
    );
  }

  console.log(`[After Update] Wishlist Size:`, updatedUser.wishlist.length);

  return res.status(200).json({
    message: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
    wishlist: updatedUser.wishlist,
  });
});

// Get User's Wishlist
export const getWishlist = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  console.log(`[Get Wishlist] User: ${id}`);

  // First get without populate to check raw data
  const rawUser = await userModel.findById(id);
  console.log(`[Raw Data] Wishlist IDs:`, rawUser.wishlist);

  const user = await userModel.findById(id).populate({
    path: "wishlist",
    select:
      "name description venue date price image capacity availableTickets status",
    populate: {
      path: "category",
      select: "name",
    },
  });

  // Filter out nulls (if event deleted) and ensure wishlist exists
  // Also ensuring we return the populated objects
  const validWishlist = (user.wishlist || []).filter(
    (item) => item && item._id
  );

  console.log(
    `[Get Wishlist] User: ${id}, Found: ${validWishlist.length} items`
  );

  return res.status(200).json({
    message: "Wishlist fetched successfully",
    wishlist: validWishlist,
  });
});

// Toggle Follow Organizer
export const toggleFollow = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { organizerId } = req.params;

  // Check if user exists
  const organizer = await userModel.findById(organizerId);
  if (!organizer) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const user = await userModel.findById(id);
  const isFollowing = user.following.includes(organizerId);

  if (isFollowing) {
    // Unfollow
    user.following = user.following.filter(
      (id) => id.toString() !== organizerId
    );
  } else {
    // Follow
    user.following.push(organizerId);
  }

  await user.save();

  return res.status(200).json({
    message: isFollowing ? "Unfollowed user" : "Followed user",
    following: user.following,
  });
});

// Get Following Organizers
export const getFollowing = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const user = await userModel.findById(id).populate({
    path: "following",
    select: "firstName lastName userName email userImage",
  });

  return res.status(200).json({
    message: "Following list fetched successfully",
    following: user.following || [],
  });
});

// Generate QR Code for Booking (if not exists)
export const generateQRCode = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;
  const { id } = req.user;

  const booking = await bookingModel.findOne({ _id: bookingId, user: id });
  if (!booking) {
    return next(new Error("Booking not found", { cause: 404 }));
  }

  // Generate QR code if not exists
  if (!booking.qrCode) {
    booking.qrCode = nanoid(20); // Unique QR code
    await booking.save();
  }

  return res.status(200).json({
    message: "QR Code generated successfully",
    qrCode: booking.qrCode,
  });
});
// Get Single Booking Details
export const getBookingDetails = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;
  const { id } = req.user;

  const booking = await bookingModel
    .findOne({ _id: bookingId, user: id })
    .populate({
      path: "event",
      select: "name description venue date price image capacity status",
      populate: {
        path: "category",
        select: "name",
      },
    });

  if (!booking) {
    return next(new Error("Booking not found", { cause: 404 }));
  }

  return res.status(200).json({
    message: "Booking details fetched successfully",
    booking,
  });
});
