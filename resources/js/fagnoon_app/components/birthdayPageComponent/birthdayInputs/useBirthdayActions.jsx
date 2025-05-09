export const useBirthdayActions = (birthdayFormData, setBirthdayFormData) => {
  // Function to add a new action
  const addNewAction = () => {
    setBirthdayFormData((prevState) => {
      const newId =
        prevState.actions.length > 0
          ? Math.max(...prevState.actions.map((a) => a.id)) + 1
          : 1;

      // Get the end time of the last action to set as start time for the new action
      let startTime = "";
      if (prevState.actions.length > 0) {
        const lastAction = prevState.actions[prevState.actions.length - 1];
        if (lastAction.endTime) {
          // Convert 12-hour format to 24-hour format for input
          const endTimeMatch = lastAction.endTime.match(/(\d+):(\d+) ([AP]M)/);
          if (endTimeMatch) {
            let hours = parseInt(endTimeMatch[1]);
            const minutes = endTimeMatch[2];
            const period = endTimeMatch[3];

            if (period === "PM" && hours < 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;

            startTime = `${hours.toString().padStart(2, "0")}:${minutes}`;
          }
        }
      }

      return {
        ...prevState,
        actions: [
          ...prevState.actions,
          {
            id: newId,
            name: "",
            value: "",
            startTime: startTime,
            duration: "",
            durationUnit: "hours",
            endTime: "",
          },
        ],
      };
    });
  };

  // Function to parse time from 24h format to Date object
  const parseTimeToDate = (timeString, dateString = "2000-01-01") => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date(dateString);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Function to parse time from 12h format to Date object
  const parse12hTimeToDate = (timeString, dateString = "2000-01-01") => {
    if (!timeString) return null;
    const match = timeString.match(/(\d+):(\d+) ([AP]M)/);
    if (!match) return null;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3];

    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const date = new Date(dateString);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Convert Date to 12-hour format string
  const formatTimeTo12h = (date) => {
    if (!date) return "";

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Calculate end time based on start time, duration, and duration unit
  const calculateActionEndTime = (startTime, duration, durationUnit) => {
    console.log("Context calculateActionEndTime called (disabled):", {
      startTime,
      duration,
      durationUnit,
    });
    return ""; // Disabled to prevent override; handled in useBirthdayInputs.js
  };

  // Check if an action end time exceeds the birthday event end time
  const checkActionEndTime = (actionEndTime, birthdayEndTime) => {
    if (!actionEndTime || !birthdayEndTime) return false;

    const actionEndDate = parse12hTimeToDate(actionEndTime);
    const birthdayEndDate = parse12hTimeToDate(birthdayEndTime);

    if (!actionEndDate || !birthdayEndDate) return false;

    return actionEndDate > birthdayEndDate;
  };

  // Function to update an action
  const updateAction = (id, updates) => {
    console.log("updateAction:", { id, updates });
    setBirthdayFormData((prevState) => {
      const actionIndex = prevState.actions.findIndex(
        (action) => action.id === id
      );
      if (actionIndex === -1) return prevState;

      const updatedActions = [...prevState.actions];
      updatedActions[actionIndex] = {
        ...updatedActions[actionIndex],
        ...updates,
      };

      // No end time recalculation here; handled in useBirthdayInputs.js
      return {
        ...prevState,
        actions: updatedActions,
      };
    });
  };

  // Function to remove an action
  const removeAction = (id) => {
    setBirthdayFormData((prevState) => {
      const actionIndex = prevState.actions.findIndex(
        (action) => action.id === id
      );
      if (actionIndex === -1) return prevState;

      const updatedActions = prevState.actions.filter(
        (action) => action.id !== id
      );

      // If we're removing an action that's not the last one, update the next action start time
      if (actionIndex < prevState.actions.length - 1 && actionIndex > 0) {
        const previousAction = prevState.actions[actionIndex - 1];
        if (previousAction.endTime) {
          // Convert 12-hour format to 24-hour format
          const endTimeMatch =
            previousAction.endTime.match(/(\d+):(\d+) ([AP]M)/);
          if (endTimeMatch) {
            let hours = parseInt(endTimeMatch[1]);
            const minutes = endTimeMatch[2];
            const period = endTimeMatch[3];

            if (period === "PM" && hours < 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;

            const startTime = `${hours.toString().padStart(2, "0")}:${minutes}`;

            updatedActions[actionIndex] = {
              ...updatedActions[actionIndex],
              startTime: startTime,
            };

            // End time recalculation handled in useBirthdayInputs.js
          }
        }
      }

      return {
        ...prevState,
        actions: updatedActions,
      };
    });
  };

  return {
    addNewAction,
    updateAction,
    removeAction,
    parseTimeToDate,
    parse12hTimeToDate,
    formatTimeTo12h,
    calculateActionEndTime,
    checkActionEndTime,
  };
};
