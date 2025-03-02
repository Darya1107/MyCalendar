import { EventProps } from "../Events/Event";
import dayjs from "dayjs";
import { DateTime } from "luxon";
import { makeAutoObservable } from "mobx";

// для сохранения отображаемого времени события
const formatTime = (dateTime: string) => {
  const localDt = DateTime.fromISO(dateTime);
  const timeValue = localDt.toString().split("T")[1];
  const timeParts = timeValue.split(":");
  return timeParts[0] + ":" + timeParts[1];
};

class CalendarStore {
  storedEvents: EventProps[] = [];
  selectedDate: string = dayjs(new Date()).format("YYYY-MM-DD");

  constructor() {
    makeAutoObservable(this);
    this.loadFromLocalStorage();
  }

  createEvent = (event: EventProps) => {
    event.startTime = formatTime(event.startDateTime);
    event.endTime = formatTime(event.endDateTime);
    if (event.remindIn) {
      event.reminderTime = DateTime.fromISO(event.startDateTime, {
        zone: "utc",
      })
        .minus({
          minutes: event.remindIn,
        })
        .toString();
    }

    this.storedEvents = [...this.storedEvents, event];
    this.saveToLocalStorage();
  };

  updateEvent = (eventId: string, newEvent: EventProps) => {
    this.deleteEvent(eventId);
    this.createEvent(newEvent);
    this.saveToLocalStorage();
  };

  deleteEvent = (eventId: string) => {
    // перезаписываем стейт для того чтобы перерендерился календарь и список событий
    this.storedEvents = this.storedEvents.filter(
      (el) => el.eventId !== eventId
    );
    this.saveToLocalStorage();
  };

  changeSelectedDate = (newDate: string) => {
    this.selectedDate = newDate;
  };

  getCurrentEvent = (eventId: string): EventProps | undefined => {
    if (!eventId) return;
    const idx = this.storedEvents.findIndex((item) => item.eventId === eventId);
    return this.storedEvents[idx];
  };

  saveToLocalStorage() {
    localStorage.setItem("myCalendarEvents", JSON.stringify(this.storedEvents));
  }

  loadFromLocalStorage() {
    const savedData = localStorage.getItem("myCalendarEvents");
    if (savedData) {
      this.storedEvents = JSON.parse(savedData);
    }
  }
}

export default CalendarStore;
