import React, { useEffect } from "react";
import { TimePicker, Select, Input, Button } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { type UpdateEventFields } from "../App";
import { useNavigate } from "react-router-dom";
import { EventProps } from "./Event";
import CalendarStore from "../stores/CalendarStore";
import { observer } from "mobx-react-lite";

const time_format = "HH:mm";

interface EventFormProps {
  fromModal: boolean;
  selectedDate: string;
  currentEvent: EventProps;
  updateLocalEvent: (updateFields: UpdateEventFields) => void;
  onSaveHandler: (eventId?: number) => void;
}

const EventForm: React.FC<EventFormProps> = observer((props) => {
  const {
    fromModal,
    selectedDate,
    currentEvent,
    updateLocalEvent,
    onSaveHandler,
  } = props;
  const { storedEvents, createEvent, updateEvent } = CalendarStore;

  const navigate = useNavigate();

  const getActualDateTime = (target: Dayjs) =>
    selectedDate + "T" + target.toISOString().split("T")[1];
  let editEvent: EventProps | undefined;
  let eventId: number;

  if (window.location.pathname.indexOf("update") !== -1) {
    eventId = Number(window.location.pathname.split("/")[2]);
    const idx = storedEvents.findIndex((item) => item.eventId === eventId);
    editEvent = { ...storedEvents[idx] };
  }

  useEffect(() => {
    if (eventId && editEvent) {
      updateLocalEvent({ ...editEvent });
    }
  }, []);

  return (
    <div className="create-event-form">
      <div>
        <Input
          value={editEvent?.eventName}
          onChange={(target) => {
            updateLocalEvent({ eventName: target.target.value });
          }}
          placeholder="Basic usage"
        />
      </div>
      <div className="create-event-form__field">
        <span>Начало:</span>
        <TimePicker
          onChange={(target) => {
            updateLocalEvent({ startDateTime: getActualDateTime(target) });
          }}
          defaultValue={dayjs(editEvent?.startTime ?? "00:00", time_format)}
          format={time_format}
          needConfirm={false}
        />
      </div>
      <div className="create-event-form__field">
        <span>Завершение:</span>
        <TimePicker
          onChange={(target) => {
            updateLocalEvent({ endDateTime: getActualDateTime(target) });
          }}
          defaultValue={dayjs(editEvent?.endTime ?? "00:00", time_format)}
          format={time_format}
          needConfirm={false}
        />
      </div>
      <div className="create-event-form__field">
        <span>Напомнить за</span>
        <Select
          style={{ width: 60 }}
          onChange={(target) => {
            updateLocalEvent({ remindIn: target.valueOf() });
          }}
          options={[
            { value: "5", label: "5" },
            { value: "10", label: "10" },
            { value: "15", label: "15" },
            { value: "30", label: "30" },
          ]}
        />
        <span>минут</span>
      </div>
      {fromModal ? null : (
        <div className="create-event-form__buttons">
          <Button
            color="primary"
            variant="solid"
            onClick={() => {
              navigate("/");
            }}
          >
            Назад
          </Button>
          <Button
            color="primary"
            variant="solid"
            onClick={() => {
              onSaveHandler(eventId);
              navigate("/");
            }}
          >
            Сохранить
          </Button>
        </div>
      )}
    </div>
  );
});

export default EventForm;
