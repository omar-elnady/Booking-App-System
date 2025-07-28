import categoryModel from "../../../DB/modules/Category.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const createCategory = asyncHandler(
    async (req, res, next) => {
        const { name } = req.body
        const isExistCategory = await categoryModel.findOne({ $or: [{ "name.en": name.en }, { "name.ar": name.ar }] })
        if (isExistCategory) {
            return next(new Error(req.t("errors.categoryAlreadyExist"), { cause: 400 }));
        }
        const newCategory = await categoryModel.create({ name })
        if (!newCategory) {
            return next(new Error(req.t("errors.createCategoryError"), { cause: 400 }));
        }
        return res.status(201).json({ message: req.t("messages.createCategory"), newCategory })
    }
)
export const getCategories = asyncHandler(async (req, res, next) => {
    const { search } = req.query;
    const queryFilter = {};

    if (search) {
        const regex = new RegExp(search, 'i');
        queryFilter.$or = [
            { "name.en": regex },
            { "name.ar": regex }
        ];
    }
    const categories = await categoryModel.find(queryFilter);

    return res.status(200).json({
        message: "Categories fetched successfully.",
        count: categories.length,
        categories
    });
});

export const getCategoryById = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const category = await categoryModel.findById(_id);

    if (!category) {
        return next(new Error(req.t("errors.categoryNotFound"), { cause: 404 }));
    }

    return res.status(200).json({ message: req.t("messages.getCategoryById"), category });
});

export const updateCategory = asyncHandler(
    async (req, res, next) => {
        const { _id } = req.params
        const { name } = req.body
        const isExistCategory = await categoryModel.findById(_id)
        if (!isExistCategory) {
            return next(new Error(req.t("errors.categoryNotFound"), { cause: 400 }));
        }
        const updatedCategory = await categoryModel.findByIdAndUpdate(_id, { name }, { new: true })
        if (!updatedCategory) {
            return next(new Error(req.t("errors.updateCategoryError"), { cause: 400 }));
        }
        return res.status(201).json({ message: req.t("messages.updateCategory"), updatedCategory })
    }
)
export const deleteCategory = asyncHandler(
    async (req, res, next) => {
        const { _id } = req.params
        const isExistCategory = await categoryModel.findById(_id)
        if (!isExistCategory) {
            return next(new Error(req.t("errors.categoryNotFound"), { cause: 400 }));
        }
        const deletedCategory = await categoryModel.findByIdAndDelete(_id)
        if (!deletedCategory) {
            return next(new Error(req.t("errors.deleteCategoryError"), { cause: 400 }));
        }
        return res.status(201).json({ message: req.t("messages.deleteCategory"), deletedCategory })
    }
)


export const getEventsByCategory = asyncHandler(
    async (req, res, next) => {
        const { category } = req.params
        const language = req.language
        const events = await eventModel.find({ category: { [language]: category } })
        if (!events) {
            return next(new Error(req.t("errors.eventsNotFound"), { cause: 400 }));
        }
        if (events.length === 0) {
            return next(new Error(req.t("errors.eventsNotFound"), { cause: 400 }));
        }
        return res.status(201).json({ message: req.t("messages.getEvents"), events })
    }
)


