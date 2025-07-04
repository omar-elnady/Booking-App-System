import eventModel from "../../../DB/modules/event.model.js";
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
    } = cleanedData;
    const file = req.file || {};

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
      existingEvent.capacity =
        capacity || existingEvent.capacity;
      if (file) {
        if (existingEvent.image.public_id) {
          await cloudinary.uploader.destroy(existingEvent.image.public_id);
        }
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          { folder: `${generateEventCode}/${language}/${name}` }
        );
        existingEvent.image = { secure_url, public_id };
      }
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
    let image = {};
    if (file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `${generateEventCode}/${language}/${name}` }
      );
      image = { secure_url, public_id };
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
  const cleanedData = trimStringsInObject(req.body);
  const {
    name,
    description,
    category,
    venue,
    eventCode,
    capacity,
    price,
    date,
    availableTickets,
  } = cleanedData;
  const file = req.file || {};
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
  let image = {};
  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${generateEventCode}/${language}/${name}` }
    );
    image = { secure_url, public_id };
  }

  const newEvent = await eventModel.create({
    name,
    description,
    category,
    venue,
    eventCode: generateEventCode,
    price,
    date,
    capacity,
    image,
    availableTickets: capacity,
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
        eventCode: 1,
        capacity: 1,
        date: 1,
        price: 1,
        image: 1,
        availableTickets: 1,
        createdAt: 1,
        updatedAt: 1,
        availableTickets: 1,
        image: {
          secure_url: "$image.secure_url",
          public_id: "$image.public_id",
        }
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

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
  const event = await eventModel.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(id),
      },
    },
    {
      $project: {
        arEvent: {
          name: "$name.ar",
          description: "$description.ar",
          category: "$category.ar",
          venue: "$venue.ar",
          date: "$date",
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
          category: "$category.en",
          venue: "$venue.en",
          date: "$date",
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
  ]);
  if (!event || event.length === 0) {
    return next(
      new Error(req.t("errors.eventNotFound"), {
        cause: 404,
      })
    );
  }
  const normalEvent = await eventModel.find({ _id: id });

  return res.json({
    message: req.t("eventsRetrievedSuccessfully"),
    arEvent: event[0].arEvent,
    enEvent: event[0].enEvent,
    normalEvent,
  });
});

export const updateEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, category, venue, date, price, availableTickets } =
    req.body;
  const language = req.language || "en";
  const isEventExist = await eventModel.findById(id);
  if (!isEventExist) {
    return next(
      new Error(req.t("errors.eventNotFound"), {
        cause: 404,
      })
    );
  }
  const file = req.file || {};
  let image = {};
  if (file) {
    if (isEventExist.image.public_id) {
      await cloudinary.uploader.destroy(isEventExist.image.public_id);
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${id}/${req.language}/${name}` }
    );
    image = { secure_url, public_id };
  }

  const event = await eventModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: { [language]: name },
        description: { [language]: description },
        category: { [language]: category },
        venue: { [language]: venue },
        date,
        price,
        availableTickets,
        image,
      },
    },
    { new: true }
  );
  return res.json({ message: req.t("eventUpdatedSuccessfully"), event });
});

export const deleteEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const isEventExist = await eventModel.findById(id);
  if (!isEventExist) {
    return next(
      new Error(req.t("errors.eventNotFound"), {
        cause: 404,
      })
    );
  }
  if (isEventExist.image.public_id) {
    await cloudinary.uploader.destroy(isEventExist.image.public_id);
  }
  await eventModel.findByIdAndDelete(id);
  return res.json({ message: req.t("eventDeletedSuccessfully") });
});
