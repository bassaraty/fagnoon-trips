import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBirthdayFormContext } from "../../../contexts/BirthdayFormContext";
import { useUserAuth } from "../../../contexts/UserAuthContext";

export default function useBirthdayInputs() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    birthdayFormData,
    updateBirthdayFormData,
    resetBirthdayFormData,
    addNewAction,
    updateAction,
    removeAction,
    closeSnackbar,
  } = useBirthdayFormContext();
  // eslint-disable-next-line no-unused-vars
  const { currentUser } = useUserAuth();

  // State for form validation errors
  const [formErrors, setFormErrors] = useState({
    birthdayName: false,
    clientName: false,
    clientNumber: false,
    birthdayDate: false,
    startTime: false,
    birthdayKidsCount: false,
    kidName: false,
    kidBirthday: false,
    gender: false,
    birthdayBranch: false,
    birthdayLocation: false,
    birthdayPackage: false,
    paymentStatus: false,
    paidAmount: false,
    paymentImage: false,
  });

  // State for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Accordion states
  const [expanded, setExpanded] = useState({
    basicInfo: true,
    kidsInfo: false,
    decorationExtras: false,
    foodBeverage: false,
    eventDetails: false,
  });

  // Local state for multiple Snackbars
  const [localSnackbar, setLocalSnackbar] = useState([]);

  // Helper to add a new Snackbar error
  const addSnackbarError = (message) => {
    const id = Date.now(); // Unique ID based on timestamp
    console.log("Adding Snackbar error:", { id, message });
    setLocalSnackbar((prev) => [
      ...prev.filter((err) => err.message !== message), // Avoid duplicates
      { id, message, open: true },
    ]);
  };

  // Initialize form data for edit mode
  useEffect(() => {
    if (location.state?.formData) {
      // Ensure birthdayLocation is an array for HO or string for MOA
      const formData = {
        ...location.state.formData,
        birthdayLocation:
          location.state.formData.birthdayBranch === "HO"
            ? Array.isArray(location.state.formData.birthdayLocation)
              ? location.state.formData.birthdayLocation
              : [location.state.formData.birthdayLocation]
            : typeof location.state.formData.birthdayLocation === "string"
            ? location.state.formData.birthdayLocation
            : "",
      };
      updateBirthdayFormData(formData);
      setIsEditMode(true);
      setEditId(location.state.formData.editId);
    } else {
      resetBirthdayFormData();
      setIsEditMode(false);
      setEditId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // Handle accordion toggle
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded((prev) => ({
      ...prev,
      [panel]: isExpanded,
    }));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateBirthdayFormData({ [name]: value });

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }

    if (name === "startTime") {
      calculateEndTime(value);
    }
  };

  // Calculate end time for overall event
  const calculateEndTime = (startTime) => {
    if (!startTime) return;

    try {
      const [hours, minutes] = startTime.split(":").map(Number);
      let totalHours = hours + 4; // 4-hour duration
      let endHours = totalHours % 24; // Handle midnight crossover
      const period = endHours >= 12 ? "PM" : "AM";
      endHours = endHours % 12 || 12; // Convert to 12-hour format
      const formattedEndTime = `${endHours}:${minutes
        .toString()
        .padStart(2, "0")} ${period}`;
      console.log("Event end time calculated:", formattedEndTime);
      updateBirthdayFormData({ endTime: formattedEndTime });
    } catch (error) {
      console.error("Error calculating event end time:", error);
    }
  };

  // Convert time to minutes since midnight, handling next-day for event end time
  const convertTo24Hour = (
    timeStr,
    is12Hour = false,
    isEventEnd = false,
    eventStartMinutes = 0
  ) => {
    if (!timeStr) {
      console.log("Invalid time string: empty or null");
      return null;
    }
    let hours, minutes, period;
    if (is12Hour) {
      const match = timeStr.match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
      if (!match) {
        console.log("Invalid 12-hour time format:", timeStr);
        return null;
      }
      hours = parseInt(match[1]);
      minutes = parseInt(match[2]);
      period = match[3].toUpperCase();
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
    } else {
      const match = timeStr.match(/(\d{1,2}):(\d{2})/);
      if (!match) {
        console.log("Invalid 24-hour time format:", timeStr);
        return null;
      }
      hours = parseInt(match[1]);
      minutes = parseInt(match[2]);
      if (hours > 23 || minutes > 59) {
        console.log("Time out of range:", { hours, minutes });
        return null;
      }
    }
    let totalMinutes = hours * 60 + minutes;
    // For event end time crossing midnight, add 24 hours if earlier than event start
    if (isEventEnd && totalMinutes < eventStartMinutes) {
      totalMinutes += 24 * 60;
      console.log("Adjusted event end time for next day:", {
        timeStr,
        totalMinutes,
      });
    }
    console.log("Converted to 24-hour:", { timeStr, totalMinutes });
    return totalMinutes;
  };

  // Calculate action end time and validate against event end time
  const calculateActionEndTime = (actionId, startTime, duration) => {
    console.log("calculateActionEndTime - Input:", {
      actionId,
      startTime,
      duration,
      eventStartTime: birthdayFormData.startTime,
      eventEndTime: birthdayFormData.endTime,
    });
    if (
      !startTime ||
      !duration ||
      !birthdayFormData.startTime ||
      !birthdayFormData.endTime
    ) {
      console.log("Missing required fields");
      return "";
    }

    try {
      // Validate duration format (HH:MM)
      const durationRegex = /^(\d+):([0-5]\d)$/;
      if (!durationRegex.test(duration)) {
        console.log("Invalid duration format:", duration);
        addSnackbarError("Invalid duration format. Use HH:MM (e.g., 1:45).");
        return "";
      }

      // Parse duration
      const [durationHours, durationMinutes] = duration.split(":").map(Number);
      if (isNaN(durationHours) || isNaN(durationMinutes)) {
        console.log("Invalid duration values:", {
          durationHours,
          durationMinutes,
        });
        addSnackbarError("Invalid duration values. Use HH:MM (e.g., 1:45).");
        return "";
      }
      const totalDurationMinutes = durationHours * 60 + durationMinutes;

      // Validate start time (24-hour, HH:MM)
      const startTimeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
      if (!startTimeRegex.test(startTime)) {
        console.log("Invalid start time format:", startTime);
        addSnackbarError("Invalid start time format. Use HH:MM (e.g., 14:30).");
        return "";
      }

      // Convert times to minutes since midnight
      const eventStartMinutes = convertTo24Hour(birthdayFormData.startTime);
      const actionStartMinutes = convertTo24Hour(startTime);
      const eventEndMinutes = convertTo24Hour(
        birthdayFormData.endTime,
        true,
        true,
        eventStartMinutes
      );

      if (
        eventStartMinutes === null ||
        actionStartMinutes === null ||
        eventEndMinutes === null
      ) {
        console.log("Invalid time values detected");
        addSnackbarError("Invalid time values detected.");
        return "";
      }

      // Validate action start time is within event bounds
      if (
        actionStartMinutes < eventStartMinutes ||
        actionStartMinutes > eventEndMinutes
      ) {
        console.log("Action start time out of event bounds:", {
          actionStartMinutes,
          eventStartMinutes,
          eventEndMinutes,
        });
        addSnackbarError(
          `Action start time must be between ${birthdayFormData.startTime} and ${birthdayFormData.endTime}.`
        );
        return "";
      }

      // Calculate action end time in minutes
      let totalMinutes = actionStartMinutes + totalDurationMinutes;

      // Check if action end time exceeds event end time
      if (totalMinutes > eventEndMinutes) {
        console.log("Action end time exceeds event end time:", {
          totalMinutes,
          eventEndMinutes,
          startTime,
          duration,
          eventEndTime: birthdayFormData.endTime,
        });
        addSnackbarError(
          `Action end time exceeds the birthday event end time (${birthdayFormData.endTime}). Please adjust the duration or start time.`
        );
        return "";
      }

      // Convert action end time to 12-hour format
      let endHours = Math.floor(totalMinutes / 60) % 24;
      let endMinutes = totalMinutes % 60;
      const period = endHours >= 12 ? "PM" : "AM";
      endHours = endHours % 12 || 12;
      const formattedEndTime = `${endHours}:${endMinutes
        .toString()
        .padStart(2, "0")} ${period}`;

      console.log("Calculated end time:", formattedEndTime);
      return formattedEndTime;
    } catch (error) {
      console.error("Error calculating action end time:", error);
      addSnackbarError("Error processing duration. Use HH:MM (e.g., 1:45).");
      return "";
    }
  };

  // Handle action specific time input changes
  const handleActionTimeChange = (actionId, field, value) => {
    console.log("handleActionTimeChange:", { actionId, field, value });
    const updates = { [field]: value };
    const action = birthdayFormData.actions.find((a) => a.id === actionId);

    if (field === "startTime" || field === "duration") {
      const startTime = field === "startTime" ? value : action.startTime;
      const duration = field === "duration" ? value : action.duration;

      // Calculate end time
      const endTime = calculateActionEndTime(actionId, startTime, duration);
      updates.endTime = endTime;

      console.log("Updating action with:", { actionId, updates });

      // Update the action
      updateAction(actionId, updates);

      // Update subsequent actions' start times
      const actionIndex = birthdayFormData.actions.findIndex(
        (a) => a.id === actionId
      );
      if (actionIndex < birthdayFormData.actions.length - 1 && endTime) {
        const nextActions = birthdayFormData.actions.slice(actionIndex + 1);
        nextActions.forEach((nextAction) => {
          // Convert endTime (12-hour format) to 24-hour format for next action's startTime
          let newStartTime = "";
          const endTimeMatch = endTime.match(/(\d+):(\d+) ([AP]M)/);
          if (endTimeMatch) {
            let hours = parseInt(endTimeMatch[1]);
            const minutes = endTimeMatch[2];
            const period = endTimeMatch[3];
            if (period === "PM" && hours < 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;
            newStartTime = `${hours.toString().padStart(2, "0")}:${minutes}`;
          } else {
            newStartTime = endTime;
          }

          const newEndTime = calculateActionEndTime(
            nextAction.id,
            newStartTime,
            nextAction.duration
          );
          console.log("Updating next action:", {
            actionId: nextAction.id,
            newStartTime,
            newEndTime,
          });
          updateAction(nextAction.id, {
            startTime: newStartTime,
            endTime: newEndTime,
          });
        });
      }
    } else {
      updateAction(actionId, updates);
    }

    // Clear errors if any
    const errorKey = `${field}_${actionId}`;
    if (formErrors[errorKey]) {
      setFormErrors((prev) => ({ ...prev, [errorKey]: false }));
    }
  };

  // Recalculate end time when start time changes
  useEffect(() => {
    if (birthdayFormData.startTime) {
      calculateEndTime(birthdayFormData.startTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthdayFormData.startTime]);

  // Handle gender selection
  const handleGenderChange = (e) => {
    updateBirthdayFormData({ gender: e.target.value });
    setFormErrors((prev) => ({ ...prev, gender: false }));
  };

  // Handle package selection
  const handleBirthdayPackageSelection = (e) => {
    updateBirthdayFormData({ birthdayPackage: e.target.value });
    setFormErrors((prev) => ({ ...prev, birthdayPackage: false }));
  };

  // Handle expected attendance selection
  const handleBirthdayExpectedAttendanceSelection = (e) => {
    updateBirthdayFormData({ birthdayExpectedAttendance: e.target.value });
    setFormErrors((prev) => ({ ...prev, birthdayExpectedAttendance: false }));
  };

  // Handle decoration theme selection
  const handleBirthdayDecorationThemeSelection = (e) => {
    updateBirthdayFormData({ decorationTheme: e.target.value });
    setFormErrors((prev) => ({ ...prev, decorationTheme: false }));
  };

  // Handle balloon color selection
  const handleBirthdayBallonColorSelection = (e) => {
    updateBirthdayFormData({ ballonColor: e.target.value });
    setFormErrors((prev) => ({ ...prev, ballonColor: false }));
  };

  // Handle art activities selection
  const handleBirthdayArtActivitiesSelection = (e) => {
    updateBirthdayFormData({ artActivities: e.target.value });
    setFormErrors((prev) => ({ ...prev, artActivities: false }));
  };

  // Handle additional extras selection
  const handleBirthdayAdditionalExtrasSelection = (e) => {
    updateBirthdayFormData({ additionalExtras: e.target.value });
    setFormErrors((prev) => ({ ...prev, additionalExtras: false }));
  };

  // Handle F&B outsourcing selection
  const handleBirthdayFBOutsourcingSelection = (e) => {
    updateBirthdayFormData({ FBOutsourcing: e.target.value });
    setFormErrors((prev) => ({ ...prev, FBOutsourcing: false }));
  };

  // Handle F&B in-house selection
  const handleBirthdayFBInHouseSelection = (e) => {
    updateBirthdayFormData({ FBInHouse: e.target.value });
    setFormErrors((prev) => ({ ...prev, FBInHouse: false }));
  };

  // Handle payment status selection
  const handlePaymentStatusChange = (e) => {
    updateBirthdayFormData({ paymentStatus: e.target.value });
    setFormErrors((prev) => ({ ...prev, paymentStatus: false }));
  };

  // Handle party leader selection
  const handleBirthdayPartyLeaderSelection = (e) => {
    updateBirthdayFormData({ partyLeader: e.target.value });
    setFormErrors((prev) => ({ ...prev, partyLeader: false }));
  };

  // Handle payment image
  const handlePaymentImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBirthdayFormData({
          paymentImage: file,
          paymentImagePreview: reader.result,
        });
        setFormErrors((prev) => ({ ...prev, paymentImage: false }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentImageClick = () => {
    document.getElementById("paymentImageUpload").click();
  };

  const handleDeletePaymentImage = (e) => {
    e.stopPropagation();
    updateBirthdayFormData({
      paymentImage: null,
      paymentImagePreview: null,
    });
  };

  // Handle feedback image
  const handleFeedbackImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBirthdayFormData({
          feedbackImage: file,
          feedbackImagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeedbackImageClick = () => {
    document.getElementById("feedbackImageUpload").click();
  };

  const handleDeleteFeedbackImage = (e) => {
    e.stopPropagation();
    updateBirthdayFormData({
      feedbackImage: null,
      feedbackImagePreview: null,
    });
  };

  // Handle Snackbar close
  const handleSnackbarClose = (id) => {
    console.log("Snackbar closed manually for ID:", id);
    setLocalSnackbar((prev) => prev.filter((err) => err.id !== id));
    closeSnackbar();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Expand all accordions to show any potential errors
    setExpanded({
      basicInfo: true,
      kidsInfo: true,
      decorationExtras: true,
      foodBeverage: true,
      eventDetails: true,
    });

    // Validate form fields
    const errors = {
      birthdayName: !birthdayFormData.birthdayName,
      clientName: !birthdayFormData.clientName,
      clientNumber: !birthdayFormData.clientNumber,
      birthdayDate: !birthdayFormData.birthdayDate,
      startTime: !birthdayFormData.startTime,
      birthdayKidsCount: !birthdayFormData.birthdayKidsCount,
      kidName: !birthdayFormData.kidName,
      kidBirthday: !birthdayFormData.kidBirthday,
      gender: !birthdayFormData.gender,
      birthdayBranch: !birthdayFormData.birthdayBranch,
      birthdayLocation: Array.isArray(birthdayFormData.birthdayLocation)
        ? birthdayFormData.birthdayLocation.length === 0
        : !birthdayFormData.birthdayLocation,
      birthdayPackage: !birthdayFormData.birthdayPackage,
      paymentStatus: !birthdayFormData.paymentStatus,
      paidAmount:
        birthdayFormData.paymentStatus === "paid" &&
        !birthdayFormData.paidAmount,
      paymentImage:
        birthdayFormData.paymentStatus === "paid" &&
        !birthdayFormData.paymentImage,
    };

    // Add validation for action time fields
    birthdayFormData.actions.forEach((action) => {
      if (action.value) {
        errors[`startTime_${action.id}`] = !action.startTime;
        errors[`duration_${action.id}`] = !action.duration;
      }
    });

    setFormErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some((error) => error)) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Create form data to submit
      const formData = new FormData();

      // Append all form fields to formData
      const formFields = [
        "birthdayName",
        "clientName",
        "clientNumber",
        "birthdayDate",
        "startTime",
        "duration",
        "endTime",
        "birthdayKidsCount",
        "kidName",
        "gender",
        "kidBirthday",
        "birthdayBranch",
        "birthdayPackage",
        "birthdayExpectedAttendance",
        "decorationTheme",
        "ballonColor",
        "artActivities",
        "additionalExtras",
        "FBOutsourcing",
        "FBInHouse",
        "paymentStatus",
        "paidAmount",
        "remarksOfPayment",
        "partyLeader",
        "startTimeOfEvent",
      ];

      formFields.forEach((field) => {
        if (
          birthdayFormData[field] !== undefined &&
          birthdayFormData[field] !== null
        ) {
          formData.append(field, birthdayFormData[field]);
        }
      });

      // Append birthdayLocation based on type
      if (Array.isArray(birthdayFormData.birthdayLocation)) {
        formData.append(
          "birthdayLocation",
          JSON.stringify(birthdayFormData.birthdayLocation)
        );
      } else {
        formData.append("birthdayLocation", birthdayFormData.birthdayLocation);
      }

      // Append actions as JSON string
      if (birthdayFormData.actions && birthdayFormData.actions.length > 0) {
        formData.append("actions", JSON.stringify(birthdayFormData.actions));
      }

      // Append payment image if exists
      if (birthdayFormData.paymentImage) {
        formData.append("paymentImage", birthdayFormData.paymentImage);
      }

      // Append feedback image if exists
      if (birthdayFormData.feedbackImage) {
        formData.append("feedbackImage", birthdayFormData.feedbackImage);
      }

      // Here you would typically make an API call to submit the form data
      // For now, we'll log it and simulate a successful submission
      console.log(
        "Form data prepared for submission:",
        Object.fromEntries(formData.entries())
      );

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form after successful submission
      resetBirthdayFormData();

      // Navigate to events page with success state
      navigate("/events", {
        state: {
          success: true,
          message: isEditMode
            ? "Birthday updated successfully"
            : "Birthday created successfully",
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        error.message || "Failed to save birthday. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    resetBirthdayFormData();
    setFormErrors({
      birthdayName: false,
      clientName: false,
      clientNumber: false,
      birthdayDate: false,
      startTime: false,
      birthdayKidsCount: false,
      kidName: false,
      kidBirthday: false,
      gender: false,
      birthdayBranch: false,
      birthdayLocation: false,
      birthdayPackage: false,
      paymentStatus: false,
      paidAmount: false,
      paymentImage: false,
    });
  };

  return {
    birthdayFormData,
    formErrors,
    isEditMode,
    isSubmitting,
    submitError,
    expanded,
    localSnackbar,
    handleAccordionChange,
    handleInputChange,
    handleActionTimeChange,
    handleGenderChange,
    handleBirthdayPackageSelection,
    handleBirthdayExpectedAttendanceSelection,
    handleBirthdayDecorationThemeSelection,
    handleBirthdayBallonColorSelection,
    handleBirthdayArtActivitiesSelection,
    handleBirthdayAdditionalExtrasSelection,
    handleBirthdayFBOutsourcingSelection,
    handleBirthdayFBInHouseSelection,
    handlePaymentStatusChange,
    handleBirthdayPartyLeaderSelection,
    handlePaymentImageChange,
    handlePaymentImageClick,
    handleDeletePaymentImage,
    handleFeedbackImageChange,
    handleFeedbackImageClick,
    handleDeleteFeedbackImage,
    handleSubmit,
    handleCancel,
    addNewAction,
    updateAction,
    removeAction,
    handleSnackbarClose,
  };
}
