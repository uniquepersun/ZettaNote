import { createContext, useEffect, useState } from 'react';

const authContext = createContext();
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setuser] = useState(
    localStorage.getItem('zetta_user') ? JSON.parse(localStorage.getItem('zetta_user')) : null
  );
  useEffect(() => {
    localStorage.setItem('zetta_user', JSON.stringify(user));
  }, [user]);

  const value = {
    user,
    setuser,
  };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export default authContext;
