import { BrowserRouter, Routes, Route } from "react-router";
import { useNotifications, atalhoTheme } from "reapop";
import NotificationsSystem from "reapop";
import { useEffect } from "react";

import "./App.css";
import Login from "./components/Login/Login.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import Landing from "./components/Landing/Landing.jsx";
import GameDescription from "./components/GameDescription/GameDescription.jsx";
import Scoreboard from "./components/ScoreBoard/Scoreboard.jsx";
import ProfilePage from "./components/Profile/Profile.jsx";
import ThemeSettings from "./components/ThemeSettings/ThemeSettings.jsx";
import QuestLoader from "./components/Loading/QuestLoader.jsx";
import SpaceLoader from "./components/Loading/SpaceLoading.jsx";
import WoodlandLoader from "./components/Loading/WoodlandLoader.jsx";
import ArcadeLoader from "./components/Loading/ArcadeLoader.jsx";

function App() {
  const { notifications, dismissNotification } = useNotifications();
  // At the very top of your App.js
useEffect(() => {
  const savedTheme = localStorage.getItem("user-theme") || "theme-space";
  document.body.classList.add(savedTheme);
}, []);
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="game-desc" element={<GameDescription />} />
          <Route path="scoreboard" element={<Scoreboard />} />
          <Route
            path="profile"
            element={<ProfilePage />}
          />
          <Route path="theme-settings" element={<ThemeSettings />} />
          <Route path="quest-loading" element={<QuestLoader />} />
          <Route path="arcade-loading" element={<ArcadeLoader />} />
          <Route path="woodland-loading" element={<WoodlandLoader />} />
          <Route path="space-loading" element={<SpaceLoader/>} />
        </Routes>
        <NotificationsSystem
          notifications={notifications}
          dismissNotification={(id) => dismissNotification(id)}
          theme={atalhoTheme}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
