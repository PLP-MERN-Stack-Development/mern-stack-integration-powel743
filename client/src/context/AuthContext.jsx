// /client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Function to safely retrieve and parse user data from localStorage
const getUserInfoFromStorage = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Could not parse user info from local storage:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(getUserInfoFromStorage());

  // Called upon successful login/registration
  const login = (data) => {
    // data must contain user details and the JWT token
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  // Called upon logout
  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to simplify consumption of the context
export const useAuth = () => {
  return useContext(AuthContext);
};
// End of /client/src/context/AuthContext.jsx