// src/contexts/AttendanceMenuContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

// Initial state for the attendance menu form
const INITIAL_ATTENDANCE_MENU_STATE = {
  birthdayName: "",
  guestName: "",
  adultsCount: "",
  adults: [], // Array to store multiple adult data
  kidsCount: "",
  kids: [], // Array to store multiple kid data
  remarks: "",
};

// Create the context
const AttendanceMenuContext = createContext();

// Provider component
export const AttendanceMenuProvider = ({ children }) => {
  // State for attendance menu form data
  const [attendanceMenuData, setAttendanceMenuData] = useState(
    INITIAL_ATTENDANCE_MENU_STATE
  );

  // Update adults array when adultsCount changes
  useEffect(() => {
    const count = parseInt(attendanceMenuData.adultsCount) || 0;

    if (count > 0) {
      // Create or resize adults array based on count
      const updatedAdults = [...attendanceMenuData.adults];

      // Add new empty adult objects if needed
      while (updatedAdults.length < count) {
        updatedAdults.push({ name: "", number: "" });
      }

      // Remove extra adult objects if count was decreased
      if (updatedAdults.length > count) {
        updatedAdults.length = count;
      }

      setAttendanceMenuData((prev) => ({
        ...prev,
        adults: updatedAdults,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceMenuData.adultsCount]);

  // Update kids array when kidsCount changes
  useEffect(() => {
    const count = parseInt(attendanceMenuData.kidsCount) || 0;

    if (count > 0) {
      // Create or resize kids array based on count
      const updatedKids = [...attendanceMenuData.kids];

      // Add new empty kid objects if needed
      while (updatedKids.length < count) {
        updatedKids.push({ name: "" });
      }

      // Remove extra kid objects if count was decreased
      if (updatedKids.length > count) {
        updatedKids.length = count;
      }

      setAttendanceMenuData((prev) => ({
        ...prev,
        kids: updatedKids,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceMenuData.kidsCount]);

  // Function to update specific form fields
  const updateAttendanceMenuData = (updates) => {
    setAttendanceMenuData((prevState) => ({
      ...prevState,
      ...updates,
    }));
  };

  // Function to update a specific adult's data
  const updateAdultData = (index, field, value) => {
    const updatedAdults = [...attendanceMenuData.adults];
    updatedAdults[index] = {
      ...updatedAdults[index],
      [field]: value,
    };

    setAttendanceMenuData((prev) => ({
      ...prev,
      adults: updatedAdults,
    }));
  };

  // Function to update a specific kid's data
  const updateKidData = (index, field, value) => {
    const updatedKids = [...attendanceMenuData.kids];
    updatedKids[index] = {
      ...updatedKids[index],
      [field]: value,
    };

    setAttendanceMenuData((prev) => ({
      ...prev,
      kids: updatedKids,
    }));
  };

  // Function to reset form data
  const resetAttendanceMenuData = () => {
    setAttendanceMenuData(INITIAL_ATTENDANCE_MENU_STATE);
  };

  // Value to be provided to consumers
  const contextValue = {
    attendanceMenuData,
    updateAttendanceMenuData,
    updateAdultData,
    updateKidData,
    resetAttendanceMenuData,
  };

  return (
    <AttendanceMenuContext.Provider value={contextValue}>
      {children}
    </AttendanceMenuContext.Provider>
  );
};

// Custom hook for using the attendance menu form context
// eslint-disable-next-line react-refresh/only-export-components
export const useAttendanceMenuContext = () => {
  const context = useContext(AttendanceMenuContext);

  // Throw an error if used outside of a provider
  if (!context) {
    throw new Error(
      "useAttendanceMenuContext must be used within a AttendanceMenuProvider"
    );
  }

  return context;
};
