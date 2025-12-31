import React, { useState, useEffect } from "react";
import "./ThemeSettings.css";

const themes = [
  { id: "theme-space", name: "Space Odyssey", icon: "🚀", color: "#1a237e" },
  { id: "theme-quest", name: "Fantasy Quest", icon: "🧙", color: "#6a1b9a" },
  { id: "theme-arcade", name: "Retro Arcade", icon: "🕹️", color: "#ff5252" },
  { id: "theme-woodland", name: "Woodland", icon: "🌲", color: "#4e342e" },
];

const ThemeSettings = () => {
  const [activeTheme, setActiveTheme] = useState(
    localStorage.getItem("user-theme") || "theme-space"
  );

  const handleThemeChange = (themeId) => {
    // 1. Remove all possible theme classes from body
    themes.forEach((t) => document.body.classList.remove(t.id));
    
    // 2. Add the selected theme class
    document.body.classList.add(themeId);
    
    // 3. Update State and LocalStorage
    setActiveTheme(themeId);
    localStorage.setItem("user-theme", themeId);
  };

  // Ensure theme is applied on component mount
  useEffect(() => {
    handleThemeChange(activeTheme);
  }, []);

  return (
    <div className="card-primary p-6 max-w-md mx-auto mt-10" style={{ backgroundColor: "var(--bg-card)" }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--accent-primary)" }}>
        Appearance
      </h2>
      <p className="text-muted mb-6">Choose your interface style</p>

      <div className="grid grid-cols-1 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              activeTheme === theme.id ? "scale-105 shadow-lg" : "opacity-70 hover:opacity-100"
            }`}
            style={{
              borderColor: activeTheme === theme.id ? "var(--accent-primary)" : "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-main)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{theme.icon}</span>
              <span className="font-semibold">{theme.name}</span>
            </div>
            {activeTheme === theme.id && (
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: "var(--accent-primary)" }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSettings;