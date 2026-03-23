// src/context/AppContext.jsx
import React, { createContext, useContext, useState } from "react";

// 1️⃣ Create context
const AppContext = createContext();

// 2️⃣ Provider component
export const AppProvider = ({ children }) => {

  const [loading, setLoading] = useState(false);
  const [authCardPopUp, setAuthCardPopUp] = useState(false);

  // Start and stop loading functions
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return (
    <AppContext.Provider
      value={{
        loading,
        startLoading,
        stopLoading,
        authCardPopUp, 
        setAuthCardPopUp
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// 3️⃣ Custom hook for easy use
export const useAppContext = () => useContext(AppContext);
