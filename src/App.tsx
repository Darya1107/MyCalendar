import "./styles.css";
import "./Events/events.scss";
import MainPage from "./MainPage/MainPage";
import { CalendarStoreContext } from "./stores/CalendarStoreProvider";
import CalendarStore from "./stores/CalendarStore";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventForm from "./Events/EventForm";
import { notification } from "antd";

export type NotificationType = "success" | "info" | "warning" | "error";

const App = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    message: string,
    description: string,
    type: NotificationType
  ) => {
    api[type]({
      message: message,
      description: description,
      placement: "topRight",
    });
  };

  return (
    <CalendarStoreContext.Provider value={new CalendarStore()}>
      {contextHolder}
      <Router>
        <Routes>
          <Route
            path="/"
            element={<MainPage openNotification={openNotification} />}
          />
          <Route
            path="/create"
            element={
              <EventForm
                fromModal={false}
                openNotification={openNotification}
              />
            }
          />
          <Route
            path="/update/:id"
            element={
              <EventForm
                fromModal={false}
                openNotification={openNotification}
              />
            }
          />
        </Routes>
      </Router>
    </CalendarStoreContext.Provider>
  );
};

export default App;
