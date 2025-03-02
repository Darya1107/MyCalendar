import { createContext, useContext } from "react";
import CalendarStore from "./CalendarStore";

export const CalendarStoreContext = createContext<CalendarStore | null>(null);

export const useStore = () => {
  const context = useContext(CalendarStoreContext);
  if (context === null) {
    throw new Error("You should wrap the component with Provider");
  }
  return context;
};
