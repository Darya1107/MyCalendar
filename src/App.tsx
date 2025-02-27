import "./styles.css";
import "./Events/events.scss";
import MainPage from "./MainPage/MainPage";
import { observer } from "mobx-react-lite";
import CalendarStore from "./stores/CalendarStore";
import { useEffect, useState } from "react";
import { notification } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventForm from "./Events/EventForm";
import { type EventProps } from "./Events/Event";
import dayjs from "dayjs";

export type UpdateEventFields = Partial<EventProps>;

const App = observer(() => {
  const { storedEvents, createEvent, updateEvent, deleteEvent } = CalendarStore;

  const [currentEvent, setCurrentEvent] = useState<EventProps>({
    eventId: 0,
    eventName: "",
    eventDate: "",
    startDateTime: "",
    endDateTime: "",
  });
  const [api, contextHolder] = notification.useNotification();
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );

  const dateChangeHandler = (date: string) => {
    setSelectedDate(date);
  };
  const updateLocalEvent = (updatedFields: UpdateEventFields) => {
    setCurrentEvent((prevEvent) => ({
      ...prevEvent,
      ...updatedFields,
    }));
  };

  const openNotification = (eventName: string, eventStartTime: string = "") => {
    api.info({
      message: `Уведомление`,
      description: `У вас запланировано событие ${eventName} с ${eventStartTime}`,
      placement: "topRight",
    });
  };

  const onSaveHandler = (eventId?: number) => {
    if (eventId) {
      updateEvent(eventId, {
        ...currentEvent,
        eventId,
        eventDate: selectedDate,
      });
    } else {
      // timestamp в качестве уникального айди для тестового проекта
      const timestamp = new Date().getTime();
      const newEvent = {
        ...currentEvent,
        eventDate: selectedDate,
        eventId: timestamp,
      };

      createEvent(newEvent);
    }
  };

  /*
    Пока страница открыта раз в минуту запускается проверка на наличие 
    "приближающихся" событий, о которых необходимо уведомить
    Значения выбраны комфортные для тестирования приложения 
*/
  useEffect(() => {
    const intervalId = setInterval(() => {
      const futureEvents = storedEvents.filter((item) => {
        return item.reminderTime && new Date(item.reminderTime) > new Date();
      });
      for (let event of futureEvents) {
        const timeDiff = dayjs(new Date(event.reminderTime ?? 0)).diff(
          dayjs(new Date())
        );
        if (timeDiff <= 60000) {
          setTimeout(() => {
            openNotification(event.eventName, event?.startTime);
          }, timeDiff);
        }
      }
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {contextHolder}
              <MainPage
                selectedDate={selectedDate}
                storedEvents={storedEvents}
                currentEvent={currentEvent}
                updateLocalEvent={updateLocalEvent}
                createEvent={createEvent}
                deleteEvent={deleteEvent}
                dateChangeHandler={dateChangeHandler}
              />
            </>
          }
        />
        <Route
          path="/create"
          element={
            <EventForm
              fromModal={false}
              selectedDate={selectedDate}
              currentEvent={currentEvent}
              updateLocalEvent={updateLocalEvent}
              onSaveHandler={onSaveHandler}
            />
          }
        />
        <Route
          path="/update/:id"
          element={
            <EventForm
              fromModal={false}
              selectedDate={selectedDate}
              currentEvent={currentEvent}
              updateLocalEvent={updateLocalEvent}
              onSaveHandler={onSaveHandler}
            />
          }
        />
      </Routes>
    </Router>
  );
});

export default App;
