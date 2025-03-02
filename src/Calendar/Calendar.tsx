import React from "react";
import { Badge, CalendarProps, Calendar } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/CalendarStoreProvider";

const MyCalendar: React.FC<{}> = observer(() => {
  const { storedEvents, selectedDate, changeSelectedDate } = useStore();
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
    switch (info.type) {
      case "date":
        return dateCellRender(current);
      case "month":
        return monthCellRender(current);
      default:
        return info.originNode;
    }
  };

  const onSelectHandler = (newValue: Dayjs) => {
    changeSelectedDate(newValue.format("YYYY-MM-DD"));
  };
  return (
    <Calendar
      defaultValue={dayjs(selectedDate, "YYYY-MM-DD")}
      cellRender={cellRender}
      onSelect={onSelectHandler}
    />
  );
});

export default MyCalendar;
