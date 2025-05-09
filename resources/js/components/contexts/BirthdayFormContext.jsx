import React, { createContext, useContext, useState } from "react";
import { useBirthdayActions } from "../components/birthdayPageComponent/birthdayInputs/useBirthdayActions";

// Initial state for the birthday form
const INITIAL_BIRTHDAY_FORM_STATE = {
  birthdayName: "",
  clientName: "",
  clientNumber: "",
  birthdayDate: "",
  startTime: "",
  duration: "4 hours",
  endTime: "",
  birthdayKidsCount: "",
  kidName: "",
  gender: "",
  kidBirthday: "",
  birthdayBranch: "",
  birthdayLocation: [],
  birthdayPackage: "",
  birthdayExpectedAttendance: "",
  attendanceMenu: "",
  decorationTheme: "",
  ballonColor: "",
  artActivities: "",
  additionalExtras: "",
  FBOutsourcing: "",
  FBInHouse: "",
  paymentStatus: "",
  paidAmount: "",
  paymentImage: null,
  paymentImagePreview: null,
  remarksOfPayment: "",
  feedbackImage: null,
  feedbackImagePreview: null,
  partyLeader: "",
  startTimeOfEvent: "",
  actions: [
    {
      id: 1,
      name: "",
      value: "",
      startTime: "",
      duration: "",
      durationUnit: "hours",
      endTime: "",
    },
  ],
  showSnackbar: false,
  snackbarMessage: "",
};

// Create the context
const BirthdayFormContext = createContext();

// Provider component
export const BirthdayFormProvider = ({ children }) => {
  // State for birthday form data
  const [birthdayFormData, setBirthdayFormData] = useState(
    INITIAL_BIRTHDAY_FORM_STATE
  );

  // Use the birthday actions hook
  const {
    addNewAction,
    updateAction,
    removeAction,
    parseTimeToDate,
    parse12hTimeToDate,
    formatTimeTo12h,
    calculateActionEndTime,
    checkActionEndTime,
  } = useBirthdayActions(birthdayFormData, setBirthdayFormData);

  // Function to update specific form fields
  const updateBirthdayFormData = (updates) => {
    setBirthdayFormData((prevState) => ({
      ...prevState,
      ...updates,
    }));
  };

  // Function to close snackbar
  const closeSnackbar = () => {
    setBirthdayFormData((prevState) => ({
      ...prevState,
      showSnackbar: false,
      snackbarMessage: "",
    }));
  };

  // Function to reset form data
  const resetBirthdayFormData = () => {
    setBirthdayFormData(INITIAL_BIRTHDAY_FORM_STATE);
  };

  // Value to be provided to consumers
  const contextValue = {
    birthdayFormData,
    updateBirthdayFormData,
    resetBirthdayFormData,
    addNewAction,
    updateAction,
    removeAction,
    closeSnackbar,
    parseTimeToDate,
    parse12hTimeToDate,
    formatTimeTo12h,
    calculateActionEndTime,
    checkActionEndTime,
  };

  return (
    <BirthdayFormContext.Provider value={contextValue}>
      {children}
    </BirthdayFormContext.Provider>
  );
};

// Custom hook for using the birthday form context
// eslint-disable-next-line react-refresh/only-export-components
export const useBirthdayFormContext = () => {
  const context = useContext(BirthdayFormContext);

  // Throw an error if used outside of a provider
  if (!context) {
    throw new Error(
      "useBirthdayFormContext must be used within a BirthdayFormProvider"
    );
  }

  return context;
};
