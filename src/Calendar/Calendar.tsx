import React from "react";
import { Badge, CalendarProps, Calendar } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { EventProps } from "../Events/Event";

const MyCalendar: React.FC<{
  storedEvents: EventProps[];
  selectedDate: string;
  dateChangeHandler: (date: string) => void;
}> = ({ storedEvents, selectedDate, dateChangeHandler }) => {
  const monthCellRender = (value: Dayjs) => {
    const countEvents = storedEvents.filter(
      (el) => new Date(el.eventDate).getMonth() === value.month()
    ).length;
    return countEvents ? (
      <div className="notes-month">
        <span>Total events: {countEvents}</span>
      </div>
    ) : null;
  };
  const dateCellRender = (value: Dayjs) => {
    const listData = storedEvents.filter(
      (el) => el.eventDate === value.format("YYYY-MM-DD")
    );
    return (
      <div className="events">
        {listData.map((item: any) => (
          <div key={item.eventId}>
            <Badge status={"success"} text={item.eventName} />
          </div>
        ))}
      </div>
    );
  };
  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  const onSelectHandler = (newValue: Dayjs) => {
    dateChangeHandler(newValue.format("YYYY-MM-DD"));
  };
  return (
    <Calendar
      defaultValue={dayjs(selectedDate, "YYYY-MM-DD")}
      cellRender={cellRender}
      onSelect={onSelectHandler}
    />
  );
};

export default MyCalendar;
