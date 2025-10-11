import { createContext, useState, useEffect } from 'react';

const themeContext = createContext();
// eslint-disable-next-line react/prop-types
export const ThemeProvider = ({ children }) => {
  const [theme, settheme] = useState(localStorage.getItem('zetta_theme') || 'light');

  useEffect(() => {
    localStorage.setItem('zetta_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const value = {
    theme,
    settheme,
  };
  return <themeContext.Provider value={value}>{children}</themeContext.Provider>;
};

//eslint-disable-next-line react-refresh/only-export-components
export default themeContext;
