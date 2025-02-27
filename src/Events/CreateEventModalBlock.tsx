import React from "react";
import { Button, Modal, notification } from "antd";
import EventForm from "./EventForm";
import { type MainPageProps } from "../MainPage/MainPage";

interface CreateEventBlockProps extends MainPageProps {
  isModalOpen: boolean;
  modalHandler: (modalState: boolean) => void;
}

const CreateEventModalBlock: React.FC<CreateEventBlockProps> = ({
  selectedDate,
  isModalOpen,
  currentEvent,
  updateLocalEvent,
  modalHandler,
  createEvent,
}) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api["success"]({
      message: `Событие создано`,
      placement: "top",
    });
  };

  const showModal = () => {
    modalHandler(true);
  };

  const handleOk = () => {
    // timestamp в качестве уникального айди для тестового проекта
    const timestamp = new Date().getTime();
    const newEvent = {
      ...currentEvent,
      eventDate: selectedDate,
      eventId: timestamp,
    };

    createEvent(newEvent);
    openNotification();
    modalHandler(false);
  };

  const handleCancel = () => {
    modalHandler(false);
  };

  return (
    <div className="create-event__button">
      {contextHolder}
      <Button color="primary" variant="solid" onClick={showModal}>
        +
      </Button>
      <Modal
        title="New event"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <EventForm
          fromModal={true}
          selectedDate={selectedDate}
          currentEvent={currentEvent}
          updateLocalEvent={updateLocalEvent}
          onSaveHandler={() => {}}
        />
      </Modal>
    </div>
  );
};

export default CreateEventModalBlock;
