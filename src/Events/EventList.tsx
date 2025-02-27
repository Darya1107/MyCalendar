import React from "react";
import Event, { type EventProps } from "./Event";

interface EventListProps {
  selectedDate: string;
  storedEvents: EventProps[];
  deleteEvent: (eventId: number) => void;
}

const EventList: React.FC<EventListProps> = ({
  selectedDate,
  storedEvents,
  deleteEvent,
}) => {
  const selectedDayEvents = storedEvents.filter(
    (el) => el.eventDate === selectedDate
  );

  return (
    <div className="event-list">
      {selectedDayEvents?.length
        ? selectedDayEvents.map((item) => {
            return (
              <Event
                key={item.eventId}
                eventItem={item}
                deleteEvent={deleteEvent}
              />
            );
          })
        : null}
    </div>
  );
};

export default EventList;
