import categoryModel from "../../../DB/modules/Category.model.js";
import eventModel from "../../../DB/modules/Event.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // Validation handles structure, now check duplicates
  const isExistCategory = await categoryModel.findOne({
    $or: [{ "name.en": name.en }, { "name.ar": name.ar }],
  });

  if (isExistCategory) {
    return next(
      new Error(req.t("errors.categoryAlreadyExist"), { cause: 409 })
    );
  }

  const status =
    req.user.role?.toLowerCase() === "organizer" ? "Pending" : "Active";
  const newCategory = await categoryModel.create({
    name,
    status,
    creatorId: req.user._id,
  });
  return res.status(201).json({
    message:
      status === "Pending"
        ? req.t("messages.categoryRequested") ||
          "Category request submitted for approval."
        : req.t("messages.createCategory"),
    newCategory,
  });
});

export const getCategories = asyncHandler(async (req, res, next) => {
  const { search } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const queryFilter = {};

  if (search) {
    const regex = new RegExp(search, "i");
    queryFilter.$or = [{ "name.en": regex }, { "name.ar": regex }];
  }

  const [categories, totalCount] = await Promise.all([
    categoryModel
      .find(queryFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    categoryModel.countDocuments(queryFilter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json({
    message: "Categories fetched successfully.",
    categories,
    pagination: {
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
    },
  });
});

export const getCategoryById = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const category = await categoryModel.findById(_id);

  if (!category) {
    return next(new Error(req.t("errors.categoryNotFound"), { cause: 404 }));
  }

  return res
    .status(200)
    .json({ message: req.t("messages.getCategoryById"), category });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const { name, status } = req.body;
  const isExistCategory = await categoryModel.findById(_id);

  if (!isExistCategory) {
    return next(new Error(req.t("errors.categoryNotFound"), { cause: 404 }));
  }

  const updateData = {};
  if (name?.en) updateData["name.en"] = name.en;
  if (name?.ar) updateData["name.ar"] = name.ar;
  if (status) updateData.status = status;

  const updatedCategory = await categoryModel.findByIdAndUpdate(
    _id,
    { $set: updateData },
    { new: true }
  );

  return res.status(200).json({
    message: req.t("messages.updateCategory"),
    updatedCategory,
  });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const isExistCategory = await categoryModel.findById(_id);
  if (!isExistCategory) {
    return next(new Error(req.t("errors.categoryNotFound"), { cause: 404 }));
  }

  // Check if any events use this category
  const eventsUsingCategory = await eventModel.findOne({ category: _id });
  if (eventsUsingCategory) {
    return next(
      new Error(req.t("errors.categoryInUse"), {
        cause: 400,
      })
    );
  }

  await categoryModel.findByIdAndDelete(_id);

  return res.status(200).json({ message: req.t("messages.deleteCategory") });
});

export const getEventsByCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.params;
  const language = req.language || "en";
  const categoryDoc = await categoryModel.findOne({
    [`name.${language}`]: name,
  });
  if (!categoryDoc) {
    return next(new Error(req.t("errors.eventsNotFound"), { cause: 400 }));
  }
  const events = await eventModel.aggregate([
    { $match: { category: categoryDoc._id } },
    {
      $project: {
        name: `$name.${language}`,
        description: `$description.${language}`,
        venue: `$venue.${language}`,
        eventCode: 1,
        capacity: 1,
        date: 1,
        price: 1,
        image: 1,
        availableTickets: 1,
      },
    },
  ]);
  if (!events || events.length === 0) {
    return next(new Error(req.t("errors.eventsNotFound"), { cause: 400 }));
  }
  return res.status(200).json({
    message: req.t("messages.eventsRetrievedSuccessfully"),
    events,
  });
});

export const getPendingCategories = asyncHandler(async (req, res, next) => {
  const pendingCategories = await categoryModel
    .find({ status: "Pending" })
    .populate("creatorId", "userName email userImage");

  return res.status(200).json({
    message: "Pending categories fetched successfully",
    requests: pendingCategories,
  });
});

// Handle Category Request (Approve/Reject)
export const handleCategoryRequest = asyncHandler(async (req, res, next) => {
  const { categoryId, status } = req.body; // status: "approved" | "rejected"

  if (!["approved", "rejected"].includes(status)) {
    return next(new Error("Invalid status", { cause: 400 }));
  }

  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(
      new Error(req.t("errors.categoryNotFound") || "Category not found", {
        cause: 404,
      })
    );
  }

  if (category.status !== "Pending") {
    return next(new Error("Category is not pending approval", { cause: 400 }));
  }

  if (status === "approved") {
    category.status = "Active";
  } else {
    category.status = "Rejected";
  }

  await category.save();

  return res.status(200).json({
    message: `Category ${status} successfully`,
    category,
  });
});
