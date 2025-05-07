import e from "express";
import eventModel from "../../../DB/modules/event.model.js";
import { trimStringsInObject } from "../../../utils/cleanSpace.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { paginate } from "../../../utils/paginate.js";

export const createSingleLanguageEvent = asyncHandler(
  async (req, res, next) => {
    const cleanedData = trimStringsInObject(req.body);
    const {
      name,
      description,
      category,
      venue,
      eventCode,
      price,
      date,
      image,
      availableTickets,
    } = cleanedData;

    const language = req.language || "en";

    const existingEvent = await eventModel.findOne({ eventCode });

    if (existingEvent) {
      if (
        existingEvent.name?.[language] &&
        existingEvent.description?.[language] &&
        existingEvent.category?.[language] &&
        existingEvent.venue?.[language]
      ) {
        return next(
          new Error(req.t("errors.eventLanguageExist"), { cause: 400 })
        );
      }

      existingEvent.name[language] = name;
      existingEvent.description[language] = description;
      existingEvent.category[language] = category;
      existingEvent.venue[language] = venue;
      existingEvent.price = price || existingEvent.price;
      existingEvent.date = date || existingEvent.date;
      existingEvent.availableTickets =
        availableTickets || existingEvent.availableTickets;

      await existingEvent.save();

      return res.status(200).json({
        message: req.t("messages.secondLanguageEventAddSuccessfully"),
      });
    }
    let generateEventCode =
      "EVT-" + Math.random().toString(36).substring(2, 10);

    while (await eventModel.findOne({ eventCode: generateEventCode })) {
      generateEventCode = "EVT-" + Math.random().toString(36).substring(2, 10);
    }

    const newEvent = await eventModel.create({
      name: { [language]: name },
      description: { [language]: description },
      category: { [language]: category },
      venue: { [language]: venue },
      eventCode: generateEventCode,
      price,
      date,
      image,
      availableTickets,
    });

    res.status(201).json({
      message: req.t("messages.createEventSuccessfully"),
      event: newEvent,
    });
  }
);

export const createMultiLanguageEvent = asyncHandler(async (req, res, next) => {
  const cleanedData = trimStringsInObject(req.body);
  const {
    name,
    description,
    category,
    venue,
    eventCode,
    price,
    date,
    image,
    availableTickets,
  } = cleanedData;

  const existingEvent = await eventModel.findOne({
    name,
    description,
    category,
    venue,
  });
  if (existingEvent) {
    return next(new Error(req.t("errors.eventAlreadyExist"), { cause: 400 }));
  }

  let generateEventCode =
    eventCode || "EVT-" + Math.random().toString(36).substring(2, 10);

  while (await eventModel.findOne({ eventCode: generateEventCode })) {
    generateEventCode = "EVT-" + Math.random().toString(36).substring(2, 10);
  }

  const newEvent = await eventModel.create({
    name,
    description,
    category,
    venue,
    eventCode: generateEventCode,
    price,
    date,
    image,
    availableTickets,
  });

  res.status(201).json({
    message: req.t("messages.createEventSuccessfully"),
    event: newEvent,
  });
});

export const getEvents = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate(req.query.page, req.query.size);
  const search = req.query.search || "";
  const cleanSearch = search.replace(/"/g, "");
  const regex = new RegExp(cleanSearch, "i");
  const language = req.language || "en";
  const totalEvents = await eventModel.countDocuments({
    $or: [
      { name: { $regex: regex } },
      { description: { $regex: regex } },
      { category: { $regex: regex } },
      { venue: { $regex: regex } },
    ],
  });
  const events = await eventModel.aggregate([
    {
      $match: {
        $or: [
          { [`name.${language}`]: { $regex: regex } },
          { [`description.${language}`]: { $regex: regex } },
          { [`category.${language}`]: { $regex: regex } },
          { [`venue.${language}`]: { $regex: regex } },
        ],
      },
    },
    {
      $project: {
        name: `$name.${language}`,
        description: `$description.${language}`,
        category: `$category.${language}`,
        venue: `$venue.${language}`,
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

  const totalPages = Math.ceil(totalEvents / limit);
  return res.json({
    message: "events retrieved successfully",
    events,
    totalPages,
    totalEvents,
  });
});
