import React from "react";
import Modal from "@/components/common/Modal";
import EventForm from "@features/events/components/EventForm";

const EventFormModal = ({
  open,
  onOpenChange,
  selectedEvent,
  onSubmit,
  onCancel,
  isLoading,
  categories,
  onAddCategory,
  t,
}) => {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="max-w-3xl"
      title={
        selectedEvent
          ? t("manageEvents.updateCategoryDesc")
          : t("manageEvents.addNew")
      }
      description={t("management.eventsSubtitle")}
    >
      <EventForm
        onSubmit={onSubmit}
        initialData={selectedEvent}
        categories={categories}
        isLoading={isLoading}
        onCancel={onCancel}
        onAddCategory={onAddCategory}
      />
    </Modal>
  );
};

export default EventFormModal;
