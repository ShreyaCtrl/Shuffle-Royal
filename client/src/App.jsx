import { BrowserRouter, Routes, Route } from "react-router";
import { useNotifications, atalhoTheme } from "reapop";
import NotificationsSystem from "reapop";

import "./App.css";
import Login from "./components/Login/Login.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import Landing from "./components/Landing/Landing.jsx";
import GameDescription from "./components/GameDescription/GameDescription.jsx";
import Scoreboard from "./components/ScoreBoard/Scoreboard.jsx";


function App() {
  const { notifications, dismissNotification } = useNotifications();
  
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
            element={<div>Profile Page - Coming Soon!</div>}
          />
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
