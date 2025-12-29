import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Upload,
  X,
  Calendar as CalendarIcon,
  Clock,
  Image as ImageIcon,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export default function EventForm({
  onSubmit,
  initialData,
  categories,
  isLoading,
  onCancel,
}) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: { en: "", ar: "" },
      description: { en: "", ar: "" },
      venue: { en: "", ar: "" },
      date: "",
      time: "",
      price: "",
      capacity: "",
      category: "",
    },
  });

  const watchImage = watch("image");

  useEffect(() => {
    if (initialData) {
      setValue("name.en", initialData.name?.en || "");
      setValue("name.ar", initialData.name?.ar || "");
      setValue("description.en", initialData.description?.en || "");
      setValue("description.ar", initialData.description?.ar || "");
      setValue("venue.en", initialData.venue?.en || "");
      setValue("venue.ar", initialData.venue?.ar || "");
      setValue(
        "date",
        initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : ""
      );
      if (initialData.date) {
        const d = new Date(initialData.date);
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        setValue("time", `${hours}:${minutes}`);
      }

      setValue("price", initialData.price || 0);
      setValue("capacity", initialData.capacity || 100);
      setValue(
        "category",
        initialData.category?._id || initialData.category || ""
      );

      if (initialData.image?.secure_url) {
        setPreview(initialData.image.secure_url);
      }
    }
  }, [initialData, setValue]);

  useEffect(() => {
    if (watchImage && watchImage[0]) {
      const file = watchImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [watchImage]);

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", JSON.stringify(data.name));
    formData.append("description", JSON.stringify(data.description));
    formData.append("venue", JSON.stringify(data.venue));

    if (data.date) {
      const dateTimeString = data.time
        ? `${data.date}T${data.time}`
        : data.date;
      formData.append("date", dateTimeString);
    }

    formData.append("price", data.price);
    formData.append("capacity", data.capacity);
    formData.append("category", data.category);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    onSubmit(formData);
  };

  const get12hTime = (time24) => {
    if (!time24) return { timePart: "12:00", period: "PM" };
    const [h, m] = time24.split(":");
    const hour24 = parseInt(h);
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    return {
      timePart: `${String(hour12).padStart(2, "0")}:${m}`,
      period,
    };
  };

  const to24hTime = (time12, p) => {
    let [h, m] = time12.split(":");
    let hour24 = parseInt(h);
    if (isNaN(hour24)) hour24 = 12;
    if (p === "PM" && hour24 < 12) hour24 += 12;
    if (p === "AM" && hour24 === 12) hour24 = 0;
    return `${String(hour24).padStart(2, "0")}:${m || "00"}`;
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
          e.preventDefault();
          handleSubmit(handleFormSubmit)();
        }
      }}
      className="space-y-6 max-h-[75vh] overflow-y-auto px-2 custom-scrollbar"
    >
      {/* 📸 Image Upload */}
      <div className="space-y-2">
        <Label className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-[0.2em]">
          {t("manageEvents.multiLanguageDetails")}
        </Label>
        <div
          className={cn(
            "relative aspect-[21/9] w-full border-2 border-dashed border-border/60 rounded-2xl overflow-hidden transition-all bg-muted/20 flex items-center justify-center group cursor-pointer hover:border-primary/40 hover:bg-muted/30",
            errors.image && "border-destructive/40 bg-destructive/5"
          )}
          onClick={() => document.getElementById("image-upload").click()}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="font-bold rounded-xl shadow-2xl scale-90 group-hover:scale-100 transition-transform"
                >
                  {t("manageEvents.updateCategoryDesc")}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground/60 group-hover:text-primary/70 transition-colors">
              <div className="p-4 bg-background rounded-full shadow-sm border border-border/40">
                <ImageIcon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {t("manageEvents.addNew")}
              </span>
            </div>
          )}
          <input
            id="image-upload"
            type="file"
            {...register("image")}
            accept="image/*"
            className="hidden"
          />
        </div>
        {errors.image && (
          <p className="text-[10px] text-destructive font-bold uppercase tracking-wider mt-1 px-1">
            {errors.image.message || t("common.required")}
          </p>
        )}
      </div>

      {/* 📝 Name Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground/90 tracking-tight">
            {t("eventForm.eventName.labelEn")}
          </Label>
          <Input
            {...register("name.en", { required: true })}
            placeholder={t("eventForm.eventName.placeholderEn")}
            className={cn(
              "h-11 rounded-xl bg-background border-border/80 focus:ring-1 focus:ring-primary/20 transition-all font-medium",
              errors.name?.en && "border-destructive/50 bg-destructive/5"
            )}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground/90 tracking-tight text-right block">
            {t("eventForm.eventName.labelAr")}
          </Label>
          <Input
            {...register("name.ar", { required: true })}
            placeholder={t("eventForm.eventName.placeholderAr")}
            dir="rtl"
            className={cn(
              "h-11 rounded-xl bg-background border-border/80 focus:ring-1 focus:ring-primary/20 transition-all font-medium text-right",
              errors.name?.ar && "border-destructive/50 bg-destructive/5"
            )}
          />
        </div>
      </div>

      <Separator className="opacity-40" />

      {/* 📅 Scheduling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground/90 tracking-tight">
            {t("eventForm.eventDate.labelEn")}
          </Label>
          <Controller
            name="date"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-between font-semibold rounded-xl border-border/80 px-3.5 bg-background hover:bg-muted/50 transition-all",
                      !field.value && "text-muted-foreground",
                      errors.date && "border-destructive/50 bg-destructive/5"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP", {
                        locale: i18n.language === "ar" ? ar : enUS,
                      })
                    ) : (
                      <span>{t("eventForm.eventDate.placeholderEn")}</span>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 rounded-2xl border-border/40 shadow-2xl z-[200]"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(date.toISOString().split("T")[0]);
                      }
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                    locale={i18n.language === "ar" ? ar : enUS}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground/90 tracking-tight">
            {t("eventForm.eventTime.labelEn")}
          </Label>
          <Controller
            name="time"
            control={control}
            rules={{ required: true }}
            render={({ field }) => {
              const { timePart, period } = get12hTime(field.value);
              return (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="10:30"
                      value={timePart}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9:]/g, "");
                        if (val.length === 2 && !val.includes(":")) val += ":";
                        if (val.length > 5) val = val.slice(0, 5);
                        field.onChange(to24hTime(val, period));
                      }}
                      className={cn(
                        "h-11 pl-9 rounded-xl bg-background border-border/80 font-semibold focus:ring-1 focus:ring-primary/20",
                        errors.time && "border-destructive/50 bg-destructive/5"
                      )}
                    />
                  </div>
                  <Select
                    value={period}
                    onValueChange={(p) =>
                      field.onChange(to24hTime(timePart, p))
                    }
                  >
                    <SelectTrigger className="h-11 w-24 rounded-xl bg-background border-border/80 font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[200]">
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              );
            }}
          />
        </div>
      </div>

      {/* 📍 Venue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground/90 tracking-tight">
            {t("eventForm.eventVenue.labelEn")}
          </Label>
          <Input
            {...register("venue.en", { required: true })}
            placeholder={t("eventForm.eventVenue.placeholderEn")}
            className={cn(
              "h-11 rounded-xl bg-background border-border/80",
              errors.venue?.en && "border-destructive/50 bg-destructive/5"
            )}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground/90 tracking-tight text-right block">
            {t("eventForm.eventVenue.labelAr")}
          </Label>
          <Input
            {...register("venue.ar", { required: true })}
            placeholder={t("eventForm.eventVenue.placeholderAr")}
            dir="rtl"
            className={cn(
              "h-11 rounded-xl bg-background border-border/80 text-right",
              errors.venue?.ar && "border-destructive/50 bg-destructive/5"
            )}
          />
        </div>
      </div>

      {/* 💰 Inventory */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground/90 tracking-tight">
            {t("eventDetails.ticketPrice")}
          </Label>
          <Input
            type="number"
            min="0"
            onKeyDown={(e) => {
              if (["-", "e", "E", "+"].includes(e.key)) e.preventDefault();
            }}
            {...register("price", { required: true, min: 0 })}
            className={cn(
              "h-11 rounded-xl bg-background border-border/80 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              errors.price && "border-destructive/50 bg-destructive/5"
            )}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground/90 tracking-tight">
            {t("eventForm.eventCapacity.labelEn")}
          </Label>
          <Input
            type="number"
            min="1"
            onKeyDown={(e) => {
              if (["-", "e", "E", "+", "."].includes(e.key)) e.preventDefault();
            }}
            {...register("capacity", { required: true, min: 1 })}
            className={cn(
              "h-11 rounded-xl bg-background border-border/80 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              errors.capacity && "border-destructive/50 bg-destructive/5"
            )}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground/90 tracking-tight">
            {t("buttons.categoryLabel")}
          </Label>
          <Controller
            name="category"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={cn(
                    "h-11 rounded-xl bg-background border-border/80 font-bold",
                    errors.category && "border-destructive/50 bg-destructive/5"
                  )}
                >
                  <SelectValue placeholder={t("buttons.selectCategory")} />
                </SelectTrigger>
                <SelectContent className="z-[150] rounded-xl shadow-2xl border-border/60">
                  {categories?.length > 0 ? (
                    categories.map((cat) => (
                      <SelectItem
                        key={cat._id}
                        value={cat._id}
                        className="font-bold py-2.5"
                      >
                        {isRtl
                          ? cat.name?.ar || cat.name
                          : cat.name?.en || cat.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      No categories found
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <Separator className="opacity-40" />

      {/* 📖 Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground/90 tracking-tight">
            {t("eventForm.eventDescription.labelEn")}
          </Label>
          <Textarea
            {...register("description.en", { required: true })}
            placeholder={t("eventForm.eventDescription.placeholderEn")}
            className={cn(
              "min-h-[120px] rounded-xl bg-background border-border/80 resize-none font-medium leading-relaxed",
              errors.description?.en && "border-destructive/50 bg-destructive/5"
            )}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground/90 tracking-tight text-right block">
            {t("eventForm.eventDescription.labelAr")}
          </Label>
          <Textarea
            {...register("description.ar", { required: true })}
            placeholder={t("eventForm.eventDescription.placeholderAr")}
            dir="rtl"
            className={cn(
              "min-h-[120px] rounded-xl bg-background border-border/80 resize-none font-medium leading-relaxed text-right",
              errors.description?.ar && "border-destructive/50 bg-destructive/5"
            )}
          />
        </div>
      </div>

      {/* 🏁 Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-border/40 sticky bottom-0 bg-background/80 backdrop-blur-sm z-10 pb-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="font-bold text-muted-foreground/70 hover:text-foreground rounded-xl px-6"
        >
          {t("buttons.cancel")}
        </Button>
        <Button
          type="submit"
          className="min-w-[160px] font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10 transition-all h-12"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : initialData ? (
            t("saveChanges")
          ) : (
            t("manageEvents.createEvent")
          )}
        </Button>
      </div>
    </form>
  );
}
