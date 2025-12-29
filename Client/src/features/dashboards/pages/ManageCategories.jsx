import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import { Loader2, Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ROLES } from "@/lib/roles";
import { DashboardPageHeader } from "@/components/DashboardPageHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ManageCategories() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [search] = useState("");
  const { data, isLoading } = useCategories(search);
  const { mutate: createCategory, isLoading: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isLoading: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isLoading: isDeleting } = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ en: "", ar: "" });

  // Permissions Helpers
  const canManageAll = [ROLES.SUPER_ADMIN, ROLES.ADMIN]
    .map((r) => r.toLowerCase())
    .includes(user?.role?.toLowerCase());

  const canEdit = (category) => {
    if (canManageAll) return true;
    if (user?.role?.toLowerCase() === ROLES.ORGANIZER.toLowerCase()) {
      return (
        category.createdBy === user?._id || category.creatorId === user?._id
      );
    }
    return false;
  };

  const categories = data?.categories || [];

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ en: "", ar: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      en: category.name.en || "",
      ar: category.name.ar || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete._id, {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setCategoryToDelete(null);
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.en || !formData.ar) {
      toast.error(t("common.fillAllFields"));
      return;
    }

    if (editingCategory) {
      updateCategory(
        { id: editingCategory._id, data: { name: formData } },
        {
          onSuccess: () => setIsModalOpen(false),
        }
      );
    } else {
      createCategory(
        { name: formData },
        {
          onSuccess: () => setIsModalOpen(false),
        }
      );
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("manageEvents.tabCategories")}
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            {t("manageEvents.subtitle")}
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="font-bold gap-2 h-11 px-6 rounded-xl shadow-lg shadow-primary/5 active:scale-95 transition-all bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={18} />
          {t("manageEvents.addCategory")}
        </Button>
      </div>

      <div className="border border-border/40 rounded-xl bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground font-medium">
            {t("events.noEventsFound")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/30 border-b border-border/40">
                <tr>
                  <th className="px-6 py-4 font-bold text-foreground/80 text-[13px] uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 font-bold text-foreground/80 text-[13px] uppercase tracking-wider">
                    {t("categoriesForm.labelEn")}
                  </th>
                  <th className="px-6 py-4 font-bold text-foreground/80 text-[13px] uppercase tracking-wider">
                    {t("categoriesForm.labelAr")}
                  </th>
                  <th className="px-6 py-4 font-bold text-foreground/80 text-[13px] uppercase tracking-wider text-right">
                    {t("management.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {categories.map((cat, idx) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-6 py-4 text-muted-foreground/60 font-mono text-xs font-bold">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 font-bold text-sm tracking-tight text-foreground/90">
                      {cat.name?.en}
                    </td>
                    <td className="px-6 py-4 font-bold text-sm tracking-tight text-foreground/90 font-cairo">
                      {cat.name?.ar}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Logic: SuperAdmin/Admin can edit all. Organizer can edit only their own (if createdBy matches) */}
                        {canEdit(cat) && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEdit(cat)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(cat)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                              disabled={isDeleting}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? t("manageEvents.editCategory")
                : t("manageEvents.addCategory")}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? t("manageEvents.updateCategoryDesc")
                : t("manageEvents.addCategoryDesc")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  {t("categoriesForm.labelEn")}
                </label>
                <Input
                  value={formData.en}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, en: e.target.value }))
                  }
                  placeholder={t("categoriesForm.placeholderEn")}
                  className="h-11 rounded-xl bg-background border-border/60 focus:ring-1 focus:ring-primary/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  {t("categoriesForm.labelAr")}
                </label>
                <Input
                  value={formData.ar}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ar: e.target.value }))
                  }
                  placeholder={t("categoriesForm.placeholderAr")}
                  className="h-11 rounded-xl bg-background border-border/60 focus:ring-1 focus:ring-primary/20 text-right"
                  dir="rtl"
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                {t("buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  t("buttons.save")
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md rounded-2xl border-border/60 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive font-bold">
              <Trash2 className="h-5 w-5" /> {t("buttons.confirmDelete")}
            </DialogTitle>
            <DialogDescription className="pt-2 font-medium text-muted-foreground/80">
              {t("buttons.confirmDeleteDesc")}
              <div className="mt-2 p-3 bg-destructive/5 rounded-xl border border-destructive/10 text-destructive font-semibold text-sm">
                {categoryToDelete?.name?.[i18n.language]}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4">
            <Button
              variant="outline"
              className="rounded-xl font-semibold border-border/60"
              onClick={() => setIsDeleteOpen(false)}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl font-semibold text-white hover:bg-destructive/80 px-6 shadow-lg shadow-destructive/10"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                t("buttons.confirm")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
