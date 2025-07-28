import React from "react";
import Button from "../Button";
import { Edit, Trash } from "lucide-react";

const CategoryCard = ({ categories, language, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
      {categories?.map((category) => (
        <div
          key={category._id}
          className="space-y-2 border-2 border-gray-200 rounded-md p-3"
        >
          <div className="name space-y-1">
            <h2 className="text-2xl font-semibold">
              {language === "en" ? category?.name?.en : category?.name?.ar}
            </h2>
            <p>{language === "en" ? category?.name?.ar : category?.name?.en}</p>
          </div>
          <div className="space-x-2 flex">
            <Button
              onClick={() => onEdit(category)}
              className="bg-mainColor text-white flex items-center gap-2"
            >
              <Edit size={18} />
              Edit
            </Button>
            <Button
              onClick={() => onDelete(category._id)}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <Trash size={18} />
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
