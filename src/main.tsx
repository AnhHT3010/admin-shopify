import { AppProvider } from "@shopify/polaris";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@shopify/polaris/build/esm/styles.css";
import en from "@shopify/polaris/locales/en.json";
import "./index.css";
createRoot(document.getElementById("root")!).render(
  <AppProvider i18n={en}>
    <App />
  </AppProvider>
);
