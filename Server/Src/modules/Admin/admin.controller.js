import userModel from "../../DB/modules/User.model.js";
import eventModel from "../../DB/modules/Event.model.js";
import bookingModel from "../../DB/modules/Booking.model.js";
import permissionModel from "../../DB/modules/Permission.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import cloudinary from "../../utils/cloudinary.js";

// 6. Permissions Management
export const getPermissions = asyncHandler(async (req, res, next) => {
  let settings = await permissionModel.findOne();
  if (!settings) {
    settings = await permissionModel.create({});
  }
  return res.status(200).json({ message: "Permissions fetched", settings });
});

export const updatePermissions = asyncHandler(async (req, res, next) => {
  const { rolePermissions } = req.body;

  if (!rolePermissions) {
    return next(new Error("rolePermissions is required", { cause: 400 }));
  }

  // We use $set to ensure we replace the map/object clearly
  const settings = await permissionModel.findOneAndUpdate(
    {},
    { $set: { rolePermissions } },
    {
      new: true,
      upsert: true,
    }
  );
  return res.status(200).json({ message: "Permissions updated", settings });
});

// 1. Dashboard Overview Stats
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await userModel.countDocuments();
  const totalEvents = await eventModel.countDocuments();
  const totalBookings = await bookingModel.countDocuments({ status: "booked" });

  // Aggregate revenue from booked bookings
  const revenueData = await bookingModel.aggregate([
    { $match: { status: "booked", paymentStatus: "completed" } },
    {
      $lookup: {
        from: "events",
        localField: "event",
        foreignField: "_id",
        as: "eventDetails",
      },
    },
    { $unwind: "$eventDetails" },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$eventDetails.price" },
      },
    },
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  return res.status(200).json({
    message: "Stats fetched successfully",
    stats: {
      totalUsers,
      totalEvents,
      totalBookings,
      totalRevenue,
    },
  });
});

// 2. Chart Data
export const getChartData = asyncHandler(async (req, res, next) => {
  // Monthly Bookings for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyBookings = await bookingModel.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Revenue per event (top 5)
  const revenueByEvent = await bookingModel.aggregate([
    { $match: { status: "booked", paymentStatus: "completed" } },
    {
      $lookup: {
        from: "events",
        localField: "event",
        foreignField: "_id",
        as: "eventDetails",
      },
    },
    { $unwind: "$eventDetails" },
    {
      $group: {
        _id: "$eventDetails._id",
        name: { $first: "$eventDetails.name.en" },
        revenue: { $sum: "$eventDetails.price" },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
  ]);

  return res.status(200).json({
    message: "Chart data fetched successfully",
    data: {
      monthlyBookings,
      revenueByEvent,
    },
  });
});

// 3. User Management
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find().select("-password");
  return res.status(200).json({ message: "Users fetched", users });
});

export const updateUserRole = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!["user", "admin", "super-admin", "organizer"].includes(role)) {
    return next(new Error("Invalid role", { cause: 400 }));
  }

  const user = await userModel.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  );
  if (!user) return next(new Error("User not found", { cause: 404 }));

  return res.status(200).json({ message: "User role updated", user });
});

export const toggleUserStatus = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { status } = req.body;

  if (!["active", "inactive", "blocked"].includes(status)) {
    return next(new Error("Invalid status", { cause: 400 }));
  }

  const user = await userModel.findByIdAndUpdate(
    userId,
    { status },
    { new: true }
  );
  if (!user) return next(new Error("User not found", { cause: 404 }));

  return res.status(200).json({ message: "User status updated", user });
});

// 4. Event Management
export const getAllEvents = asyncHandler(async (req, res, next) => {
  const events = await eventModel
    .find()
    .populate("category createdBy", "name userName email");
  return res.status(200).json({ message: "Events fetched", events });
});

export const updateEventStatus = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;
  const { status } = req.body;

  const event = await eventModel.findByIdAndUpdate(
    eventId,
    { status },
    { new: true }
  );
  if (!event) return next(new Error("Event not found", { cause: 404 }));

  return res.status(200).json({ message: "Event status updated", event });
});

export const deleteEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;
  const event = await eventModel.findById(eventId);
  if (!event) return next(new Error("Event not found", { cause: 404 }));

  if (event.image?.public_id) {
    await cloudinary.uploader.destroy(event.image.public_id);
  }

  await eventModel.findByIdAndDelete(eventId);
  return res.status(200).json({ message: "Event deleted successfully" });
});

export const createEvent = asyncHandler(async (req, res, next) => {
  // Simple version for super admin
  const { name, description, venue, price, capacity, date, category } =
    req.body;
  const file = req.file;

  let image = {};
  if (file?.path) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `admin-events`,
      }
    );
    image = { secure_url, public_id };
  }

  const event = await eventModel.create({
    name: typeof name === "string" ? JSON.parse(name) : name,
    description:
      typeof description === "string" ? JSON.parse(description) : description,
    venue: typeof venue === "string" ? JSON.parse(venue) : venue,
    price,
    capacity,
    availableTickets: capacity,
    date,
    category,
    createdBy: req.user._id,
    status: "Active",
  });

  return res.status(201).json({ message: "Event created successfully", event });
});

export const updateEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;
  const { name, description, venue, price, capacity, date, category } =
    req.body;
  const file = req.file;

  const existingEvent = await eventModel.findById(eventId);
  if (!existingEvent) return next(new Error("Event not found", { cause: 404 }));

  const updateData = {
    name: typeof name === "string" ? JSON.parse(name) : name,
    description:
      typeof description === "string" ? JSON.parse(description) : description,
    venue: typeof venue === "string" ? JSON.parse(venue) : venue,
    price,
    capacity,
    date,
    category,
  };

  if (file?.path) {
    if (existingEvent.image?.public_id) {
      await cloudinary.uploader.destroy(existingEvent.image.public_id);
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `admin-events`,
      }
    );
    updateData.image = { secure_url, public_id };
  }

  const event = await eventModel.findByIdAndUpdate(eventId, updateData, {
    new: true,
  });
  return res.status(200).json({ message: "Event updated successfully", event });
});

// 5. Bookings & Transactions
export const getAllBookings = asyncHandler(async (req, res, next) => {
  const bookings = await bookingModel
    .find()
    .populate("user", "userName email")
    .populate("event", "name price date status")
    .populate("category", "name");

  return res.status(200).json({ message: "Bookings fetched", bookings });
});
