import transactionModel from "../../../DB/modules/Transaction.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { Types } from "mongoose";

// Get user's transaction history
export const getUserTransactions = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { type, status, page = 1, limit = 20 } = req.query;

  const query = { user: id };

  // Filter by type (payment/refund)
  if (type && ["payment", "refund"].includes(type)) {
    query.type = type;
  }

  // Filter by status
  if (
    status &&
    ["pending", "completed", "failed", "cancelled"].includes(status)
  ) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    transactionModel
      .find(query)
      .populate({
        path: "event",
        select: "name description image date venue",
      })
      .populate({
        path: "booking",
        select: "bookingDate status paymentStatus",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    transactionModel.countDocuments(query),
  ]);

  return res.status(200).json({
    message: "Transactions fetched successfully",
    transactions,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalTransactions: total,
      hasMore: skip + transactions.length < total,
    },
  });
});

// Get transaction by ID
export const getTransactionById = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { transactionId } = req.params;

  const transaction = await transactionModel
    .findOne({ _id: transactionId, user: id })
    .populate({
      path: "event",
      select: "name description image date venue price",
    })
    .populate({
      path: "booking",
      select: "bookingDate status paymentStatus qrCode",
    });

  if (!transaction) {
    return next(new Error("Transaction not found", { cause: 404 }));
  }

  return res.status(200).json({
    message: "Transaction fetched successfully",
    transaction,
  });
});

// Get transaction statistics for user
export const getTransactionStats = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const stats = await transactionModel.aggregate([
    { $match: { user: new Types.ObjectId(id) } },
    {
      $group: {
        _id: "$type",
        total: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
        failed: {
          $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
        },
      },
    },
  ]);

  const formattedStats = {
    payments: {
      total: 0,
      totalAmount: 0,
      completed: 0,
      pending: 0,
      failed: 0,
    },
    refunds: {
      total: 0,
      totalAmount: 0,
      completed: 0,
      pending: 0,
      failed: 0,
    },
  };

  stats.forEach((stat) => {
    if (stat._id === "payment") {
      formattedStats.payments = {
        total: stat.total,
        totalAmount: stat.totalAmount,
        completed: stat.completed,
        pending: stat.pending,
        failed: stat.failed,
      };
    } else if (stat._id === "refund") {
      formattedStats.refunds = {
        total: stat.total,
        totalAmount: stat.totalAmount,
        completed: stat.completed,
        pending: stat.pending,
        failed: stat.failed,
      };
    }
  });

  return res.status(200).json({
    message: "Transaction statistics fetched successfully",
    stats: formattedStats,
  });
});

// Admin: Get all transactions
export const getAllTransactions = asyncHandler(async (req, res, next) => {
  const { type, status, userId, page = 1, limit = 50 } = req.query;

  const query = {};

  if (type && ["payment", "refund"].includes(type)) {
    query.type = type;
  }

  if (
    status &&
    ["pending", "completed", "failed", "cancelled"].includes(status)
  ) {
    query.status = status;
  }

  if (userId) {
    query.user = userId;
  }

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    transactionModel
      .find(query)
      .populate({
        path: "user",
        select: "userName email firstName lastName",
      })
      .populate({
        path: "event",
        select: "name description image date",
      })
      .populate({
        path: "booking",
        select: "bookingDate status paymentStatus",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    transactionModel.countDocuments(query),
  ]);

  return res.status(200).json({
    message: "Transactions fetched successfully",
    transactions,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalTransactions: total,
    },
  });
});

// Admin: Get transaction statistics
export const getAdminTransactionStats = asyncHandler(async (req, res, next) => {
  const stats = await transactionModel.aggregate([
    {
      $group: {
        _id: {
          type: "$type",
          status: "$status",
        },
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  // Get revenue (completed payments - completed refunds)
  const revenue = await transactionModel.aggregate([
    {
      $match: { status: "completed" },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const revenueData = {
    totalPayments: 0,
    totalRefunds: 0,
    netRevenue: 0,
  };

  revenue.forEach((item) => {
    if (item._id === "payment") {
      revenueData.totalPayments = item.total;
    } else if (item._id === "refund") {
      revenueData.totalRefunds = item.total;
    }
  });

  revenueData.netRevenue = revenueData.totalPayments - revenueData.totalRefunds;

  return res.status(200).json({
    message: "Admin transaction statistics fetched successfully",
    stats,
    revenue: revenueData,
  });
});
