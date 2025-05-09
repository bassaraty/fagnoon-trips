// src/contexts/EventDataContext.jsx
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const EventDataContext = createContext();

export const EventDataProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventType, setEventType] = useState("birthdays"); // Track current event type

  const fetchEventData = async (type) => {
    try {
      setLoading(true);
      setEventType(type);

      let url = "";
      if (type === "birthdays") {
        url = "/api/birthdays";
        // For production: url = 'https://yourbackend.com/api/birthdays';
      } else if (type === "trips") {
        url = "/api/trips";
        // For production: url = 'https://yourbackend.com/api/trips';
      }

      const response = await axios.get(url);
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData("birthdays"); // Initial load
  }, []);

  const addEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const changeEventType = (type) => {
    fetchEventData(type);
  };

  const LoadingComponent = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </div>
  );

  return (
    <EventDataContext.Provider
      value={{
        events,
        loading,
        error,
        eventType,
        addEvent,
        updateEvent,
        deleteEvent,
        changeEventType,
        LoadingComponent,
      }}
    >
      {children}
    </EventDataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEventData = () => {
  const context = useContext(EventDataContext);
  if (!context) {
    throw new Error("useEventData must be used within an EventDataProvider");
  }
  return context;
};
