import { useState } from 'react'
import Login from "./components/Login/Login.jsx"
import SignUp from "./components/SignUp/SignUp.jsx"
import Landing from "./components/Landing/Landing.jsx"
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import GameDescription from './components/GameDescription/GameDescription.jsx'
import GameMenu from './pages/GameMenu/GameMenu.jsx'

function App() {

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="games" element={<GameMenu />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
