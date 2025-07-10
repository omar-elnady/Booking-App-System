import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./UserContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const EventsContext = createContext();

export function EventsProvider({ children }) {
  const { i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(2);

  const getEvents = async (page, size) => {
    try {
      const respose = await axios.get(
        `${import.meta.env.VITE_EVENTS_GET}?page=${page}&size=${size}`,
        { headers: { "accept-language": i18n.language } }
      );
      setEvents(respose?.data?.events);
    //   console.log(respose);
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    getEvents(page, size);
  }, [page, size , i18n.language]);

  return (
    <EventsContext.Provider
      value={{ page, setPage, size, setSize, events, setEvents }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvent() {
  return useContext(EventsContext);
}
