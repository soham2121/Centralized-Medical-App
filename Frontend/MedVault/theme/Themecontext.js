import React, { createContext, useContext, useState } from 'react';
import { Colors } from './index';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? Colors.dark : Colors.light;
  const toggleTheme = () => setIsDark(p => !p);
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);