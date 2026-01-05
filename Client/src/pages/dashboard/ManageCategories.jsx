import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import {
  useCategoryRequests,
  useHandleCategoryRequest,
} from "@/hooks/useAdmin";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Search,
  Inbox,
  Check,
  X,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmptyState from "@/components/common/EmptyState";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ROLES } from "@/lib/roles";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageCategories() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();

  // Search State with Debounce
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce Effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCategories(debouncedSearch);
  const { mutate: createCategory, isLoading: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isLoading: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isLoading: isDeleting } = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ en: "", ar: "" });
  const [showRequests, setShowRequests] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // 'approved' | 'rejected'
    category: null,
  });

  // Permissions Helpers
  const canManageAll = [ROLES.SUPER_ADMIN, ROLES.ADMIN]
    .map((r) => r.toLowerCase())
    .includes(user?.role?.toLowerCase());

  const isOrganizer = user?.role === ROLES.ORGANIZER;

  // Fetch pending category requests (Admin/Super Admin only)
  const { data: requestsData } = useCategoryRequests({
    enabled: canManageAll,
  });
  const handleRequest = useHandleCategoryRequest();
  const pendingRequests = requestsData?.requests || [];

  const canEdit = (category) => {
    if (canManageAll) return true;
    if (user?.role?.toLowerCase() === ROLES.ORGANIZER.toLowerCase()) {
      return (
        category.createdBy === user?._id || category.creatorId === user?._id
      );
    }
    return false;
  };

  const categories = data?.pages?.flatMap((page) => page.categories) || [];

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
        <div className="flex items-center gap-2">
          {canManageAll && pendingRequests.length > 0 && (
            <Button
              onClick={() => setShowRequests(!showRequests)}
              variant={showRequests ? "secondary" : "outline"}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {showRequests
                ? t("management.hideRequests") || "Hide Requests"
                : t("management.viewRequestsNoCount") || "View Requests"}
              <Badge
                variant="secondary"
                className="ml-1 bg-background/20 text-current hover:bg-background/30"
              >
                {pendingRequests.length}
              </Badge>
            </Button>
          )}
          {(canManageAll || isOrganizer) && (
            <Button
              onClick={handleOpenCreate}
              className="font-bold gap-2 h-11 px-6 rounded-xl shadow-lg shadow-primary/5 active:scale-95 transition-all bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={18} />
              {isOrganizer
                ? t("manageEvents.requestCategory") || "Request Category"
                : t("manageEvents.addCategory")}
            </Button>
          )}
        </div>
      </div>

      {/* Pending Category Requests Section */}
      <AnimatePresence>
        {showRequests && pendingRequests.length > 0 && canManageAll && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Card className="border-2 border-primary/20 bg-primary/5 dark:bg-primary/10 overflow-hidden mb-6">
              <CardHeader className="border-b border-primary/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <LayoutGrid className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      {t("management.pendingCategoryRequests") ||
                        "Pending Category Requests"}
                      <Badge
                        variant="secondary"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {pendingRequests.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-primary/70">
                      {t("management.pendingCategoriesSubtitle") ||
                        "Review and manage category requests from organizers"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {pendingRequests.map((req) => (
                    <div
                      key={req._id}
                      className="group relative bg-card border border-border hover:border-primary/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-lg">
                          <AvatarImage
                            src={req.creatorId?.userImage?.secure_url}
                          />
                          <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                            {req.creatorId?.userName?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground truncate">
                            @{req.creatorId?.userName}
                          </p>
                          <p className="text-[10px] uppercase font-bold text-primary/60 tracking-wider mt-1">
                            {new Date(req.createdAt).toLocaleDateString(
                              i18n.language,
                              { month: "short", day: "numeric" }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1">
                            {t("categoriesForm.labelEn")}
                          </p>
                          <p className="font-bold text-sm">{req.name?.en}</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1">
                            {t("categoriesForm.labelAr")}
                          </p>
                          <p className="font-bold text-sm font-cairo" dir="rtl">
                            {req.name?.ar}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-green-500/20"
                          size="sm"
                          onClick={() =>
                            setConfirmDialog({
                              isOpen: true,
                              type: "approved",
                              category: req,
                            })
                          }
                        >
                          <Check size={14} className="mr-1" />
                          {t("buttons.approve") || "Approve"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full text-destructive hover:bg-destructive hover:text-white border-destructive/20 hover:border-destructive transition-colors"
                          size="sm"
                          onClick={() =>
                            setConfirmDialog({
                              isOpen: true,
                              type: "rejected",
                              category: req,
                            })
                          }
                        >
                          <X size={14} className="mr-1" />
                          {t("buttons.reject") || "Reject"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        <Input
          className="pl-11 h-11 border border-border/60 bg-background shadow-sm rounded-xl"
          placeholder={t("management.searchBookings") || t("common.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border border-border/40 rounded-xl bg-card shadow-sm overflow-hidden">
        {categories.length === 0 && !isLoading ? (
          <EmptyState
            title={t("common.noResults")}
            description={t("common.noResultsDesc")}
            className="h-[400px] border-none shadow-none bg-transparent"
            action={
              searchTerm ? (
                <Button
                  variant="outline"
                  className="font-bold rounded-xl mt-4 px-8 h-11 shadow-sm border-border/60 hover:bg-muted/50 transition-all hover:scale-105 active:scale-95"
                  onClick={() => setSearchTerm("")}
                >
                  {t("common.clearSearch") || "Clear Search"}
                </Button>
              ) : null
            }
          />
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
                  {!isOrganizer && (
                    <th className="px-6 py-4 font-bold text-foreground/80 text-[13px] uppercase tracking-wider text-right">
                      {t("management.actions")}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody
                className={cn(
                  "divide-y divide-border/40",
                  isLoading &&
                    "opacity-50 pointer-events-none transition-opacity"
                )}
              >
                {categories.map((cat, idx) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-6 py-4 text-muted-foreground/60 font-mono text-xs font-bold">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 font-bold text-sm tracking-tight text-foreground/90 flex items-center gap-2">
                      {cat.name?.en}
                      {cat.status === "Pending" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 font-bold uppercase">
                          {t("dashboard.status.pending") || "Pending"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-sm tracking-tight text-foreground/90 font-cairo">
                      {cat.name?.ar}
                    </td>
                    {!isOrganizer && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {canManageAll && cat.status === "Pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateCategory({
                                  id: cat._id,
                                  data: { status: "Active" },
                                })
                              }
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-green-600 hover:bg-green-500/10 rounded-lg"
                              title={t("buttons.approve") || "Approve"}
                            >
                              <Check size={16} />
                            </Button>
                          )}
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
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="font-bold rounded-xl px-8 h-11 border-dashed border-2 border-border/60 hover:bg-muted/30"
          >
            {isFetchingNextPage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("common.loadMore") || "Load More"
            )}
          </Button>
        </div>
      )}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? t("manageEvents.editCategory")
                : isOrganizer
                ? t("manageEvents.requestCategory") || "Request Category"
                : t("manageEvents.addCategory")}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? t("manageEvents.updateCategoryDesc")
                : isOrganizer
                ? t("manageEvents.requestCategoryDesc") ||
                  "Submit a new category for admin approval."
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
              <span className="block mt-2 p-3 bg-destructive/5 rounded-xl border border-destructive/10 text-destructive font-semibold text-sm">
                {categoryToDelete?.name?.[i18n.language] ||
                  categoryToDelete?.name?.en ||
                  categoryToDelete?.name?.ar ||
                  "Category"}
              </span>
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

      {/* Category Request Confirmation Dialog */}
      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent className="max-w-md rounded-2xl border-border/60 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmDialog.type === "approved" ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <X className="h-5 w-5 text-destructive" />
              )}
              {confirmDialog.type === "approved"
                ? t("management.confirmApproveTitle") || "Approve Category?"
                : t("management.confirmRejectTitle") || "Reject Category?"}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {confirmDialog.type === "approved"
                ? t("management.confirmApproveCategoryDesc") ||
                  `Are you sure you want to approve this category request?`
                : t("management.confirmRejectCategoryDesc") ||
                  `Are you sure you want to reject this category request?`}
            </DialogDescription>
          </DialogHeader>

          {confirmDialog.category && (
            <div className="space-y-3 py-4">
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1">
                  {t("categoriesForm.labelEn")}
                </p>
                <p className="font-bold text-sm">
                  {confirmDialog.category.name?.en}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1">
                  {t("categoriesForm.labelAr")}
                </p>
                <p className="font-bold text-sm font-cairo" dir="rtl">
                  {confirmDialog.category.name?.ar}
                </p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      confirmDialog.category.creatorId?.userImage?.secure_url
                    }
                  />
                  <AvatarFallback className="text-xs">
                    {confirmDialog.category.creatorId?.userName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-semibold">
                    {t("management.requestedBy") || "Requested by"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{confirmDialog.category.creatorId?.userName}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
              }
            >
              {t("buttons.cancel") || "Cancel"}
            </Button>
            <Button
              variant={
                confirmDialog.type === "approved" ? "default" : "destructive"
              }
              className={
                confirmDialog.type === "approved"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }
              onClick={() => {
                if (confirmDialog.category && confirmDialog.type) {
                  handleRequest.mutate({
                    categoryId: confirmDialog.category._id,
                    status: confirmDialog.type,
                  });
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                }
              }}
            >
              {t("buttons.confirm") || "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
