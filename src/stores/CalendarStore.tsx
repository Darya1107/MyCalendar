import { EventProps } from "../Events/Event";
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
    // ререндер происходит засчет изменения локального стейта, поэтому здесь меняем исходный массив
    this.storedEvents.push(event);
    this.saveToLocalStorage();
  };

  updateEvent = (eventId: number, newEvent: EventProps) => {
    this.deleteEvent(eventId);
    this.createEvent(newEvent);
    this.saveToLocalStorage();
  };

  deleteEvent = (eventId: number) => {
    // перезаписываем стейт для того чтобы перерендерился календарь и список событий
    this.storedEvents = this.storedEvents.filter(
      (el) => el.eventId !== eventId
    );
    this.saveToLocalStorage();
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

export default new CalendarStore();
