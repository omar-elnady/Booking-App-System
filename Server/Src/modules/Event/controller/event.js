import eventModel from "../../../DB/modules/Event.model.js";
import { trimStringsInObject } from "../../../utils/cleanSpace.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { paginate } from "../../../utils/paginate.js";
import cloudinary from "../../../utils/cloudinary.js";
import { Types } from "mongoose";

export const createSingleLanguageEvent = asyncHandler(
  async (req, res, next) => {
    const cleanedData = trimStringsInObject(req.body);
    const {
      name,
      description,
      capacity,
      category,
      venue,
      eventCode,
      price,
      date,
      time,
    } = cleanedData;
    const file =
      req.file || (Array.isArray(req.files) ? req.files[0] : null) || {};
    const language = req.language || "en";

    // Check for existing event via eventCode
    let existingEvent = await eventModel.findOne({ eventCode });

    if (existingEvent) {
      if (
        existingEvent.name?.[language] &&
        existingEvent.description?.[language] &&
        existingEvent.venue?.[language]
      ) {
        return next(
          new Error(req.t("errors.eventLanguageExist"), { cause: 409 })
        );
      }

      const updateData = {};
      updateData[`name.${language}`] = name;
      updateData[`description.${language}`] = description;
      updateData[`venue.${language}`] = venue;
      // Should we update other fields? Probably not if they are shared, unless specified.
      // But preserving original logic:
      if (price) updateData.price = price;
      if (date) updateData.date = date;
      if (time) updateData.time = time;
      if (capacity) updateData.capacity = capacity;
      if (category && Types.ObjectId.isValid(category))
        updateData.category = new Types.ObjectId(category);

      if (file.path) {
        if (existingEvent.image?.public_id) {
          await cloudinary.uploader.destroy(existingEvent.image.public_id);
        }
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          { folder: `${existingEvent.eventCode}/${language}/${name}` }
        );
        updateData.image = { secure_url, public_id };
      }

      await eventModel.updateOne({ eventCode }, { $set: updateData });

      return res.status(200).json({
        message: req.t("messages.secondLanguageEventAddSuccessfully"),
      });
    }

    // Creating New Event
    let generateEventCode =
      eventCode || "EVT-" + Math.random().toString(36).substring(2, 10);
    while (await eventModel.findOne({ eventCode: generateEventCode })) {
      generateEventCode = "EVT-" + Math.random().toString(36).substring(2, 10);
    }

    let image = {};
    if (file.path) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `${generateEventCode}/${language}/${name}` }
      );
      image = { secure_url, public_id };
    }

    // Category Validation handled by Joi middleware or manual check
    if (!Types.ObjectId.isValid(category)) {
      return next(
        new Error(req.t("joiValidation.invalidEventId"), { cause: 400 })
      );
    }

    const newEvent = await eventModel.create({
      name: { [language]: name },
      description: { [language]: description },
      category: new Types.ObjectId(category),
      venue: { [language]: venue },
      eventCode: generateEventCode,
      price,
      date,
      time,
      image,
      capacity,
      availableTickets: capacity,
    });

    res.status(201).json({
      message: req.t("messages.createEventSuccessfully"),
      event: newEvent,
    });
  }
);

export const createMultiLanguageEvent = asyncHandler(async (req, res, next) => {
  // This function seems to be intended for creating an event with all langs at once.
  // Logic is similar but accepts 'name' as object?
  // Based on current usage in project likely unused or similar to above.
  // Will refactor to accept localized objects.
  const cleanedData = trimStringsInObject(req.body);

  // Parse JSON strings from FormData
  let parsedName, parsedDescription, parsedVenue;
  try {
    parsedName =
      typeof cleanedData.name === "string"
        ? JSON.parse(cleanedData.name)
        : cleanedData.name;
    parsedDescription =
      typeof cleanedData.description === "string"
        ? JSON.parse(cleanedData.description)
        : cleanedData.description;
    parsedVenue =
      typeof cleanedData.venue === "string"
        ? JSON.parse(cleanedData.venue)
        : cleanedData.venue;
  } catch (error) {
    return next(
      new Error("Invalid JSON format for name, description, or venue", {
        cause: 400,
      })
    );
  }

  const { category, eventCode, capacity, price, date } = cleanedData;

  const name = parsedName;
  const description = parsedDescription;
  const venue = parsedVenue;

  const file = req.file || {};

  let generateEventCode =
    eventCode || "EVT-" + Math.random().toString(36).substring(2, 10);

  // Uniqueness check loop
  while (await eventModel.findOne({ eventCode: generateEventCode })) {
    generateEventCode = "EVT-" + Math.random().toString(36).substring(2, 10);
  }

  let image = {};
  if (file.path) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${generateEventCode}/images` }
    );
    image = { secure_url, public_id };
  }

  if (!Types.ObjectId.isValid(category)) {
    return next(
      new Error(req.t("joiValidation.invalidEventId"), { cause: 400 })
    );
  }

  const newEvent = await eventModel.create({
    name,
    description,
    category: new Types.ObjectId(category),
    venue,
    eventCode: generateEventCode,
    price,
    date,
    capacity,
    availableTickets: capacity,
    image,
  });

  res.status(201).json({
    message: req.t("messages.createEventSuccessfully"),
    event: newEvent,
  });
});

export const getAllEvents = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate(req.query.page, req.query.size);
  const search = req.query.search || "";
  const cleanSearch = search.replace(/"/g, "");
  const categories = req.query.categories
    ? req.query.categories.split(",")
    : [];
  const sortBy = req.query.sortBy || req.query.sort || "newest";

  const regex = new RegExp(cleanSearch, "i");
  const language = req.language || "en";

  // Use aggregation to filter
  const pipeline = [];

  // Filter out Draft events (public view should not show drafts)
  pipeline.push({
    $match: { status: { $ne: "Draft" } },
  });

  if (cleanSearch) {
    pipeline.push({
      $match: {
        $or: [
          { [`name.en`]: { $regex: regex } },
          { [`name.ar`]: { $regex: regex } },
          { [`description.en`]: { $regex: regex } },
          { [`description.ar`]: { $regex: regex } },
          { [`venue.en`]: { $regex: regex } },
          { [`venue.ar`]: { $regex: regex } },
        ],
      },
    });
  }

  pipeline.push(
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDoc",
      },
    },
    {
      $unwind: { path: "$categoryDoc", preserveNullAndEmptyArrays: true },
    }
  );

  // Category Filtering
  if (categories.length > 0) {
    pipeline.push({
      $match: {
        $or: [
          { [`categoryDoc.name.${language}`]: { $in: categories } },
          // Also try matching against other languages if needed, or fallback
        ],
      },
    });
  }

  // Project fields
  pipeline.push({
    $project: {
      name: { $ifNull: [`$name.${language}`, `$name.en`, `$name.ar`] },
      description: {
        $ifNull: [
          `$description.${language}`,
          `$description.en`,
          `$description.ar`,
        ],
      },
      category: {
        $ifNull: [
          `$categoryDoc.name.${language}`,
          `$categoryDoc.name.en`,
          `$categoryDoc.name.ar`,
        ],
      },
      venue: { $ifNull: [`$venue.${language}`, `$venue.en`, `$venue.ar`] },
      eventCode: 1,
      capacity: 1,
      date: 1,
      time: 1,
      price: 1,
      status: 1,
      image: {
        secure_url: "$image.secure_url",
        public_id: "$image.public_id",
      },
      availableTickets: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  });

  // Sorting
  let sortStage = {};
  switch (sortBy) {
    case "price-low":
      sortStage = { price: 1 };
      break;
    case "price-high":
      sortStage = { price: -1 };
      break;
    case "date":
      sortStage = { date: 1 };
      break;
    case "popular":
      sortStage = { availableTickets: 1 }; // Placeholder logic
      break;
    case "newest":
    default:
      sortStage = { createdAt: -1 };
      break;
  }
  pipeline.push({ $sort: sortStage });

  // Pagination
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  const events = await eventModel.aggregate(pipeline);

  // Count total for pagination (approximate if using complex regex, but countDocuments is safer)
  // Note: Standard countDocuments cannot easily handle the complex pipeline (lookup/unwind filter).
  // We should run a count pipeline.

  const countPipeline = [];
  if (cleanSearch) {
    countPipeline.push({
      $match: {
        $or: [
          { [`name.en`]: { $regex: regex } },
          { [`name.ar`]: { $regex: regex } },
          { [`description.en`]: { $regex: regex } },
          { [`description.ar`]: { $regex: regex } },
          { [`venue.en`]: { $regex: regex } },
          { [`venue.ar`]: { $regex: regex } },
        ],
      },
    });
  }
  countPipeline.push(
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDoc",
      },
    },
    {
      $unwind: { path: "$categoryDoc", preserveNullAndEmptyArrays: true },
    }
  );

  if (categories.length > 0) {
    countPipeline.push({
      $match: {
        [`categoryDoc.name.${language}`]: { $in: categories },
      },
    });
  }

  countPipeline.push({ $count: "total" });

  const countResult = await eventModel.aggregate(countPipeline);
  const totalEvents = countResult.length > 0 ? countResult[0].total : 0;
  const totalPages = Math.ceil(totalEvents / limit);

  return res.json({
    message: req.t("messages.eventsRetrievedSuccessfully"),
    events,
    totalPages,
    totalEvents,
  });
});

export const getSpicificEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return next(new Error(req.t("errors.eventNotFound"), { cause: 404 }));
  }

  const pipeline = [
    {
      $match: {
        _id: new Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDoc",
      },
    },
    {
      $unwind: { path: "$categoryDoc", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        arEvent: {
          name: "$name.ar",
          description: "$description.ar",
          category: "$categoryDoc.name.ar",
          venue: "$venue.ar",
          date: "$date",
          time: "$time",
          price: "$price",
          availableTickets: "$availableTickets",
          eventCode: "$eventCode",
          image: {
            secure_url: "$image.secure_url",
            public_id: "$image.public_id",
          },
        },
        enEvent: {
          name: "$name.en",
          description: "$description.en",
          category: "$categoryDoc.name.en",
          venue: "$venue.en",
          date: "$date",
          time: "$time",
          price: "$price",
          availableTickets: "$availableTickets",
          eventCode: "$eventCode",
          image: {
            secure_url: "$image.secure_url",
            public_id: "$image.public_id",
          },
        },
      },
    },
  ];

  const event = await eventModel.aggregate(pipeline);

  if (!event || event.length === 0) {
    return next(new Error(req.t("errors.eventNotFound"), { cause: 404 }));
  }

  // Also fetch raw if needed, but aggregation covers it.
  const normalEvent = await eventModel.findById(id);

  return res.json({
    message: req.t("eventsRetrievedSuccessfully"),
    arEvent: event[0].arEvent,
    enEvent: event[0].enEvent,
    normalEvent,
  });
});

export const updateEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    description,
    category,
    venue,
    date,
    time,
    price,
    availableTickets,
  } = req.body;
  const language = req.language || "en";

  const isEventExist = await eventModel.findById(id);
  if (!isEventExist) {
    return next(new Error(req.t("errors.eventNotFound"), { cause: 404 }));
  }

  const file =
    req.file || (Array.isArray(req.files) ? req.files[0] : null) || {};

  // Construct update object using dot notation only for changed fields
  const updateQuery = { $set: {} };

  // Helper for localized updates
  const updateLocalizedField = (fieldValue, fieldName) => {
    if (!fieldValue) return;
    try {
      const parsed =
        typeof fieldValue === "string" ? JSON.parse(fieldValue) : fieldValue;
      if (typeof parsed === "object" && parsed !== null) {
        if (parsed.en) updateQuery.$set[`${fieldName}.en`] = parsed.en;
        if (parsed.ar) updateQuery.$set[`${fieldName}.ar`] = parsed.ar;
      } else {
        updateQuery.$set[`${fieldName}.${language}`] = fieldValue;
      }
    } catch (error) {
      updateQuery.$set[`${fieldName}.${language}`] = fieldValue;
    }
  };

  updateLocalizedField(name, "name");
  updateLocalizedField(description, "description");
  updateLocalizedField(venue, "venue");

  if (category && Types.ObjectId.isValid(category)) {
    updateQuery.$set.category = new Types.ObjectId(category);
  }
  if (date) updateQuery.$set.date = date;
  if (time) updateQuery.$set.time = time;
  if (price !== undefined) updateQuery.$set.price = price;

  if (availableTickets !== undefined) {
    updateQuery.$set.availableTickets = Math.min(
      Math.max(Number(availableTickets), 0),
      isEventExist.capacity
    );
  }

  if (file.path) {
    if (isEventExist.image?.public_id) {
      await cloudinary.uploader.destroy(isEventExist.image.public_id);
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${id}/${language}/${name || isEventExist.name[language]}` }
    );
    updateQuery.$set.image = { secure_url, public_id };
  }

  const event = await eventModel.findByIdAndUpdate(id, updateQuery, {
    new: true,
  });

  return res.json({ message: req.t("eventUpdatedSuccessfully"), event });
});

export const deleteEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const isEventExist = await eventModel.findById(id);

  if (!isEventExist) {
    return next(new Error(req.t("errors.eventNotFound"), { cause: 404 }));
  }

  if (isEventExist.image?.public_id) {
    await cloudinary.uploader.destroy(isEventExist.image.public_id);
  }

  await eventModel.findByIdAndDelete(id);
  return res.json({ message: req.t("eventDeletedSuccessfully") });
});
