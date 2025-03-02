import React from "react";
import { useNavigate } from "react-router-dom";

export interface EventProps {
  eventId: string;
  eventName: string;
  eventDate: string;
  startDateTime: string;
  startTime?: string;
  endDateTime: string;
  endTime?: string;
  remindIn?: number;
  reminderTime?: string;
}

const Event: React.FC<{
  eventItem: EventProps;
  deleteEvent: (eventId: string) => void;
}> = ({ eventItem, deleteEvent }) => {
  const navigate = useNavigate();

  const updateHandler = (eventId: string) => {
    navigate(`/update/${eventId}`);
  };

  return (
    <div className="event-list__item">
      <div className="event-list__item-details">
        <div>{eventItem.eventName}</div>
        <div className="event-list__item-details event-list__item-details_additional">
          с {eventItem.startTime} по {eventItem.endTime}
        </div>
      </div>
      <div className="event-list__item-buttons">
        <a
          onClick={() => {
            updateHandler(eventItem.eventId);
          }}
        >
          Редактировать
        </a>
        |
        <a
          onClick={() => {
            deleteEvent(eventItem.eventId);
          }}
        >
          Удалить
        </a>
      </div>
    </div>
  );
};

export default Event;
