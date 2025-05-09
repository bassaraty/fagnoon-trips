// src/contexts/TripFormContext.jsx
import React, { createContext, useContext, useState } from "react";

// Initial state for the trip form
const INITIAL_TRIP_FORM_STATE = {
  selectedSchool: "",
  date: "",
  startTime: "",
  duration: "4 hours",
  endTime: "",
  selectedPackage: "",
  selectedExtras: [],
  contactPerson: "",
  position: "",
  phoneNumber: "",
  schoolGrade: "",
  childrenAge: "",
  numberOfGuests: "",
  numberOfSupervisors: "",
  activity1: "",
  activity2: "",
  companyLocation: "",
  paymentStatus: "",
  paymentType: "",
  paidAmount: "",
  paymentImage: null,
  paymentImagePreview: null,
  notes: "",
};

// Create the context
const TripFormContext = createContext();

// Provider component
export const TripFormProvider = ({ children }) => {
  // State for trip form data
  const [tripFormData, setTripFormData] = useState(INITIAL_TRIP_FORM_STATE);

  // Function to update specific form fields
  const updateTripFormData = (updates) => {
    setTripFormData((prevState) => ({
      ...prevState,
      ...updates,
    }));
  };

  // Function to reset form data
  const resetTripFormData = () => {
    setTripFormData(INITIAL_TRIP_FORM_STATE);
  };

  // Value to be provided to consumers
  const contextValue = {
    tripFormData,
    updateTripFormData,
    resetTripFormData,
  };

  return (
    <TripFormContext.Provider value={contextValue}>
      {children}
    </TripFormContext.Provider>
  );
};

// Custom hook for using the trip form context
// eslint-disable-next-line react-refresh/only-export-components
export const useTripFormContext = () => {
  const context = useContext(TripFormContext);

  // Throw an error if used outside of a provider
  if (!context) {
    throw new Error(
      "useTripFormContext must be used within a TripFormProvider"
    );
  }

  return context;
};
