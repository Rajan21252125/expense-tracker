// context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { THEMES } from "../constants/Colors";

const ThemeContext = createContext();

export const ThemeProviderCustom = ({ children }) => {
  const [themeName, setThemeName] = useState("coffee");
  const [theme, setTheme] = useState(THEMES.coffee);

  // Load saved theme on startup
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("app_theme");
      if (saved && THEMES[saved]) {
        setThemeName(saved);
        setTheme(THEMES[saved]);
      }
    })();
  }, []);

  // Change theme + save it
  const changeTheme = async (name) => {
    if (!THEMES[name]) return;

    setThemeName(name);
    setTheme(THEMES[name]);
    await AsyncStorage.setItem("app_theme", name);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook
export const useTheme = () => useContext(ThemeContext);
