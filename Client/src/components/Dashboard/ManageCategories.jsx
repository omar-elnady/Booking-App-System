import React, { useState } from "react";
import Dialog from "../Dialog";
import { addCategoryForm } from "../../constants";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "../Input";
import { useCategories } from "../../context/CategoriesContext";
import Button from "../Button";

function ManageCategories() {
  const { t } = useTranslation();
  const [languageMode, setLanguageMode] = useState("En");
  const { createCategory } = useCategories();
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    categoryEn: "",
    categoryAr: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...formData,
    },
  });
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (!formData.categoryEn || !formData.categoryAr) {
  //     setToast({
  //       title: "Error",
  //       description:
  //         "Please fill in all required fields for the selected language(s).",
  //       variant: "error",
  //     });
  //     setTimeout(() => setToast(null), 3000);
  //     return;
  //   }

  //   const newEvent = {
  //     id: Date.now().toString(),

  //     categoryEn: formData.categoryEn,
  //     categoryAr: formData.categoryAr,
  //   };

  //   // onEventAdded(newEvent);
  //   setFormData({
  //     categoryEn: "",
  //     categoryAr: "",
  //   });

  //   setToast({
  //     title: "Success",
  //     description: "Event added successfully!",
  //     variant: "success",
  //   });
  //   setTimeout(() => setToast(null), 3000);
  // };

  return (
    <>
      <Dialog
        btnLabel={"Add Category"}
        title="Add Category"
        desc="Add a new category to the event"
        onSubmit={handleSubmit(createCategory)}
      >
        <form onSubmit={handleSubmit(createCategory)} className=" space-y-4">
          <div className="">
            {addCategoryForm(t).map((element) => (
              <div key={element.name} className="mb-2">
                <label
                  htmlFor={element.name}
                  className="block text-sm  font-medium text-gray-700
              dark:text-gray-700 
                 mb-1"
                >
                  {element.label}
                </label>
                <Input
                  id={element.name}
                  type={element.type}
                  placeholder={element.placeholder}
                  {...register(element.name, {
                    required: element.required,
                    pattern: element.pattern,
                    minLength: element.minLength,
                    maxLength: element.maxLength,
                  })}
                  className="py-2"
                />
                {errors[element.name] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[element.name].message ||
                      `${element.label} is invalid`}
                  </p>
                )}
              </div>
            ))}
            <div className="mt-3 py-2 text-right gap-2 flex justify-end">
              <Button
                // onClick={() => setOpen(false)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Create
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
}

export default ManageCategories;
