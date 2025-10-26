import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { NotificationsProvider } from "reapop";
import { setUpNotifications } from "reapop";

setUpNotifications({
  defaultProps: {
    position: "top-right",
    dismissible: true,
    dismissAfter: 5000, // auto dismiss after 5s
  },
});
// run once on app start (or inside SignUp useEffect)
  function setVhCssProperty() {
    // 1% of the viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  // initial set
  setVhCssProperty();

  // update on resize / orientation change
  window.addEventListener("resize", setVhCssProperty);
  window.addEventListener("orientationchange", setVhCssProperty);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </StrictMode>
);
