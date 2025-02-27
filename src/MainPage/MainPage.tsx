import React, { useState } from "react";
import { Button } from "antd";
import CreateEventModalBlock from "../Events/CreateEventModalBlock";
import EventList from "../Events/EventList";
import MyCalendar from "../Calendar/Calendar";
import { type EventProps } from "../Events/Event";
import { useNavigate } from "react-router-dom";
import { UpdateEventFields } from "../App";

export interface MainPageProps {
  selectedDate: string;
  storedEvents: EventProps[];
  currentEvent: EventProps;
  updateLocalEvent: (updatedFields: UpdateEventFields) => void;
  createEvent: (event: EventProps) => void;
  deleteEvent: (eventId: number) => void;
  dateChangeHandler: (date: string) => void;
}

const MainPage: React.FC<MainPageProps> = (props) => {
  const { selectedDate, storedEvents, deleteEvent, dateChangeHandler } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const modalHandler = (modalState: boolean) => {
    setIsModalOpen(modalState);
  };

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
          {...props}
          isModalOpen={isModalOpen}
          modalHandler={modalHandler}
        />
      </div>
      <EventList
        selectedDate={selectedDate}
        storedEvents={storedEvents}
        deleteEvent={deleteEvent}
      />
      <MyCalendar
        storedEvents={storedEvents}
        selectedDate={selectedDate}
        dateChangeHandler={dateChangeHandler}
      />
    </>
  );
};

export default MainPage;
