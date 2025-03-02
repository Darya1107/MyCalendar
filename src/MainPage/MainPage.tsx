import React, { useState, useEffect } from "react";
import { Button, notification } from "antd";
import CreateEventModalBlock from "../Events/CreateEventModalBlock";
import EventList from "../Events/EventList";
import MyCalendar from "../Calendar/Calendar";
import { useNavigate } from "react-router-dom";
import { useStore } from "../stores/CalendarStoreProvider";
import dayjs from "dayjs";
import { NotificationType } from "../App";

const MainPage: React.FC<{
  openNotification: (
    message: string,
    description: string,
    type: NotificationType
  ) => void;
}> = ({ openNotification }) => {
  const { storedEvents } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const modalHandler = (modalState: boolean) => {
    setIsModalOpen(modalState);
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
      console.log(futureEvents);
      for (let event of futureEvents) {
        const timeDiff = dayjs(new Date(event.reminderTime ?? 0)).diff(
          dayjs(new Date())
        );
        console.log(timeDiff);
        if (timeDiff <= 60000) {
          setTimeout(() => {
            openNotification(
              "Уведомление",
              `У вас запланировано событие ${event.eventName} с ${
                event?.startTime ?? ""
              } по ${event?.endTime ?? ""}`,
              "info"
            );
          }, timeDiff);
        }
      }
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="create-event">
        <Button
          color="primary"
          variant="solid"
          onClick={() => {
            navigate("/create");
          }}
        >
          Новое событие
        </Button>
        <CreateEventModalBlock
          isModalOpen={isModalOpen}
          modalHandler={modalHandler}
          openNotification={openNotification}
        />
      </div>
      <EventList />
      <MyCalendar />
    </>
  );
};

export default MainPage;
