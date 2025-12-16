import React, { useState } from "react";
import Dialog from "../Dialog";
import { addCategoryForm } from "../../constants";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "../Input";
import { useCategories } from "../../context/CategoriesContext";
import Button from "../Button";
import { Edit, Trash, Plus } from "lucide-react";
import CategoryCard from "./CategoryCard";

function ManageCategories() {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const {
    createCategory,
    deleteCategory,
    categories,
    getCategories,
    updateCategory,
  } = useCategories();
  const [toast, setToast] = useState(null);
  const [editCategory, setEditCategory] = useState(null); // Track category being edited
  const [deleteCategoryId, setDeleteCategoryId] = useState(null); // Track category to delete
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false); // Control add/edit dialog

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      categoryEn: "",
      categoryAr: "",
    },
  });

  // Handle add or edit submission
  const onSubmit = async (data) => {
    try {
      if (editCategory) {
        await updateCategory(editCategory._id, data);
        getCategories();
      } else {
        await createCategory(data);
      }
      reset();
      setEditCategory(null);
      setIsAddEditDialogOpen(false); // Close dialog
      getCategories();
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({
        title: t("common.error"),
        description: `Failed to ${
          editCategory ? "update" : "add"
        } category. Please try again.`,
        variant: "error",
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  // Handle edit button click
  const handleEdit = (category) => {
    setEditCategory(category);
    setValue("categoryEn", category?.name?.en);
    setValue("categoryAr", category?.name?.ar);
    setIsAddEditDialogOpen(true); // Open dialog directly
    console.log("Form values set:", {
      categoryEn: category.name.en,
      categoryAr: category.name.ar,
    });
  };
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory(deleteCategoryId);
      getCategories();
      setDeleteCategoryId(null);
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.log(error);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <>
      {/* Add Category Button Area */}
      <div className="flex justify-between items-center mb-6">
        <div>
           {/* Optional: Add a small sub-header or filter here if needed */}
        </div>
        <Button
          onClick={() => {
            setEditCategory(null); // Clear edit mode
            reset(); // Reset form
            setIsAddEditDialogOpen(true); // Open dialog
          }}
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t("manageEvents.addCategory")}</span>
        </Button>
      </div>

      {/* Add/Edit Category Dialog */}
      <Dialog
        title={editCategory ? t("manageEvents.editCategory") : t("manageEvents.addCategory")}
        desc={
          editCategory
            ? t("manageEvents.updateCategoryDesc")
            : t("manageEvents.addCategoryDesc")
        }
        onSubmit={handleSubmit(onSubmit)}
        isForm={true}
        reset={() => {
          reset();
          setEditCategory(null);
        }}
        open={isAddEditDialogOpen}
        setOpen={setIsAddEditDialogOpen}
      >
        <div className="space-y-4">
          {addCategoryForm(t).map((element) => (
            <div key={element.name} className="mb-2">
              <label
                htmlFor={element.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1"
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
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        title={t("manageEvents.confirmDelete")}
        desc={t("manageEvents.confirmDeleteDesc")}
        onSubmit={handleDeleteConfirm}
        isForm={false}
        open={!!deleteCategoryId}
        setOpen={(value) =>
          setDeleteCategoryId(value ? deleteCategoryId : null)
        }
      />

      {/* Categories List */}
      <CategoryCard
        categories={categories}
        language={language}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteCategoryId(id)}
      />
    </>
  );
}

export default ManageCategories;
