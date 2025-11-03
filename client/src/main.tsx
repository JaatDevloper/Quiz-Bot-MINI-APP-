import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initTelegramApp } from "./lib/telegram";
import App from "./App";
import "./index.css";

// Initialize Telegram Mini App
initTelegramApp();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
