import React from "react";
import { NotificationType } from "../App";
import { Button, Modal, notification } from "antd";
import EventForm from "./EventForm";

interface CreateEventBlockProps {
  isModalOpen: boolean;
  modalHandler: (modalState: boolean) => void;
  openNotification: (
    message: string,
    description: string,
    type: NotificationType
  ) => void;
}

const CreateEventModalBlock: React.FC<CreateEventBlockProps> = ({
  isModalOpen,
  modalHandler,
  openNotification,
}) => {
  const showModal = () => {
    modalHandler(true);
  };

  const handleCancel = () => {
    modalHandler(false);
  };

  return (
    <div className="create-event__button">
      <Button color="primary" variant="solid" onClick={showModal}>
        +
      </Button>
      <Modal
        title="New event"
        open={isModalOpen}
        onOk={() => {}}
        onCancel={handleCancel}
        footer={[]}
        destroyOnClose={true}
      >
        <EventForm
          fromModal={true}
          closeModal={handleCancel}
          openNotification={openNotification}
        />
      </Modal>
    </div>
  );
};

export default CreateEventModalBlock;
