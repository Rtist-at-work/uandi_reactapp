import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import { Toaster } from 'sonner';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster position="top-right" richColors expand />
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
