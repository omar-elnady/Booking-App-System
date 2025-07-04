import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import i18n from "./i18n.config.js";
import { EventsProvider } from "./context/EventsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EventsProvider>
      <App />
    </EventsProvider>
  </StrictMode>
);
