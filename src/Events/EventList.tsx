import React from "react";
import { useStore } from "../stores/CalendarStoreProvider";
import Event from "./Event";
import { observer } from "mobx-react-lite";

const EventList: React.FC<{}> = observer(() => {
  const { selectedDate, storedEvents, deleteEvent } = useStore();

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
});

export default EventList;
