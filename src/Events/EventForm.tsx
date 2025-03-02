import React, { useState } from "react";
import { TimePicker, Select, Input, Button, SelectProps } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import { type EventProps } from "./Event";
import { useStore } from "../stores/CalendarStoreProvider";
import { NotificationType } from "../App";

const time_format = "HH:mm";
const selectOptions = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "15", label: "15" },
  { value: "30", label: "30" },
];
type LabelRender = SelectProps["labelRender"];

const EventForm: React.FC<{
  fromModal?: boolean;
  closeModal?: () => void;
  openNotification: (
    message: string,
    description: string,
    type: NotificationType
  ) => void;
}> = ({ fromModal, closeModal, openNotification }) => {
  const { selectedDate, getCurrentEvent, createEvent, updateEvent } =
    useStore();
  const eventId = window.location.pathname.split("/")[2];
  const currentEvent = getCurrentEvent(eventId) || {
    eventId: "",
    eventName: "",
    eventDate: "",
    startDateTime: "",
    endDateTime: "",
  };

  const [localEvent, setLocalEvent] = useState<EventProps>(currentEvent);
  const navigate = useNavigate();

  const getActualDateTime = (target: Dayjs) =>
    selectedDate + "T" + target.toISOString().split("T")[1];

  const onSaveHandler = (eventId?: string) => {
    if (eventId) {
      updateEvent(eventId, {
        ...localEvent,
        eventId,
        eventDate: selectedDate,
      });
      openNotification("Событие отредактировано!", "", "success");
    } else {
      // timestamp в качестве уникального айди для тестового проекта
      const timestamp = new Date().getTime();
      const newEvent = {
        ...localEvent,
        eventDate: selectedDate,
        eventId: timestamp.toString(),
      };

      createEvent(newEvent);
      openNotification("Событие создано!", "", "success");
    }
  };

  const labelRender: LabelRender = (props) => {
    const { label, value } = props;

    if (label) {
      return value;
    }
    return <span></span>;
  };

  const closeHandler = () => {
    if (closeModal) closeModal();
    else navigate("/");
  };

  return (
    <div className="create-event-form">
      <div>
        <Input
          value={localEvent.eventName}
          onChange={(target) => {
            setLocalEvent((prev) => ({
              ...prev,
              eventName: target.target.value,
            }));
          }}
          placeholder="Basic usage"
        />
      </div>
      <div className="create-event-form__field">
        <span>Начало:</span>
        <TimePicker
          onChange={(target) => {
            setLocalEvent((prev) => ({
              ...prev,
              startDateTime: getActualDateTime(target),
            }));
          }}
          defaultValue={dayjs(localEvent.startTime ?? "00:00", time_format)}
          format={time_format}
          needConfirm={false}
        />
      </div>
      <div className="create-event-form__field">
        <span>Завершение:</span>
        <TimePicker
          onChange={(target) => {
            setLocalEvent((prev) => ({
              ...prev,
              endDateTime: getActualDateTime(target),
            }));
          }}
          defaultValue={dayjs(localEvent.endTime ?? "00:00", time_format)}
          format={time_format}
          needConfirm={false}
        />
      </div>
      <div className="create-event-form__field">
        <span>Напомнить за</span>
        <Select
          labelRender={labelRender}
          defaultValue={localEvent.remindIn}
          style={{ width: 60 }}
          onChange={(target) => {
            setLocalEvent((prev) => ({
              ...prev,
              remindIn: target.valueOf(),
            }));
          }}
          options={selectOptions}
        />
        <span>минут</span>
      </div>
      <div
        className={`create-event-form__buttons${
          fromModal ? " create-event-form__buttons_modal" : ""
        }`}
      >
        <Button color="primary" variant="solid" onClick={closeHandler}>
          Назад
        </Button>
        <Button
          color="primary"
          variant="solid"
          onClick={() => {
            onSaveHandler(eventId);
            closeHandler();
          }}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
};

export default EventForm;
