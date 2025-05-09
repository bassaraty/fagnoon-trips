import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useContext, createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText$1 from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Snackbar from "@mui/material/Snackbar";
import Typography$1 from "@mui/material/Typography";
import { N as Navbar, u as useUserAuth, S as SidebarNav } from "./Navbar-DpiuqVvx.js";
import { Breadcrumbs, Link, Typography, FormHelperText } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
function BirthdayInfo() {
  return /* @__PURE__ */ jsxs("div", { className: "birthdayInfo", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "birthdayInfoBreadcrumbsContainer", children: /* @__PURE__ */ jsxs(
      Breadcrumbs,
      {
        "aria-label": "breadcrumb",
        separator: "›",
        className: "birthdayInfoBreadcrumbs",
        children: [
          /* @__PURE__ */ jsx(Link, { underline: "hover", color: "inherit", href: "/birthdays", children: "Birthday" }),
          /* @__PURE__ */ jsx(Typography, { style: { color: "#4b4b4b" }, children: "Home" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("h1", { className: "birthdayInfoTitle", children: "Birthday Creation" })
  ] });
}
const BirthdayKidsCount = ({
  name,
  value,
  onChange,
  placeholder,
  required
}) => {
  const handleIncrement = () => {
    const newValue = (parseInt(value) || 0) + 1;
    onChange({ target: { name, value: newValue.toString() } });
  };
  const handleDecrement = () => {
    const newValue = Math.max((parseInt(value) || 0) - 1, 0);
    onChange({ target: { name, value: newValue.toString() } });
  };
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      onChange({ target: { name, value: newValue } });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "customNumberInputContainer", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        name,
        value,
        onChange: handleInputChange,
        placeholder,
        className: "customNumberInput",
        required
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "customNumberInputButtons", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleIncrement,
          className: "customNumberInputButton customNumberInputButtonPlus",
          children: "+"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleDecrement,
          className: "customNumberInputButton customNumberInputButtonMinus",
          children: "-"
        }
      )
    ] })
  ] });
};
const GeneralInputDialog = ({
  isOpen,
  onClose,
  onAddFunction,
  dialogTitle
}) => {
  const [newStateName, setNewStateName] = useState("");
  const handleAddItem = () => {
    if (newStateName.trim()) {
      onAddFunction(newStateName.trim());
      setNewStateName("");
    }
  };
  const handleClose = () => {
    onClose();
    setNewStateName("");
  };
  return /* @__PURE__ */ jsxs(Dialog, { open: isOpen, onClose: handleClose, children: [
    /* @__PURE__ */ jsx(DialogTitle, { children: dialogTitle }),
    /* @__PURE__ */ jsx(DialogContent, { children: /* @__PURE__ */ jsx(
      TextField,
      {
        autoFocus: true,
        margin: "dense",
        label: `${dialogTitle}`,
        type: "text",
        fullWidth: true,
        variant: "standard",
        value: newStateName,
        onChange: (e) => setNewStateName(e.target.value)
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogActions, { children: [
      /* @__PURE__ */ jsx(Button, { onClick: handleClose, children: "Cancel" }),
      /* @__PURE__ */ jsx(Button, { onClick: handleAddItem, children: "Add" })
    ] })
  ] });
};
const GeneralAccordion = ({
  selectedItem,
  onItemSelection,
  required = false,
  error = false,
  defaultContent,
  inputTitle,
  accordionTitle,
  dialogTitle,
  errorMessage,
  showDialog = true
}) => {
  const [localContent, setLocalContent] = useState(defaultContent || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    const filteredContent = defaultContent ? defaultContent.filter((item) => !item.disabled) : [];
    setLocalContent(filteredContent);
  }, [defaultContent, inputTitle]);
  const handleOpenAddItemDialog = () => {
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const handleAddItem = (newState) => {
    const itemExists = localContent.some(
      (item) => item.name.toLowerCase() === newState.toLowerCase()
    );
    if (!itemExists) {
      setLocalContent([...localContent, { name: newState }]);
    }
    setIsDialogOpen(false);
  };
  const contentJsx = localContent.filter((item) => !item.disabled).map((item, index) => /* @__PURE__ */ jsx(
    FormControlLabel,
    {
      value: `${item.name}`,
      control: /* @__PURE__ */ jsx(Radio, {}),
      label: item.name
    },
    index
  ));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: inputTitle }),
    /* @__PURE__ */ jsxs(FormControl, { error, fullWidth: true, children: [
      /* @__PURE__ */ jsxs(Accordion, { className: "tripsInputsFormCardAccordion", children: [
        /* @__PURE__ */ jsx(
          AccordionSummary,
          {
            expandIcon: /* @__PURE__ */ jsx(ExpandMoreIcon, {}),
            "aria-controls": "panel1-content",
            id: "panel1-header",
            children: /* @__PURE__ */ jsx(
              Typography$1,
              {
                className: "tripsInputsFormCardAccordionTitle",
                component: "span",
                children: accordionTitle
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs(AccordionDetails, { className: "tripsInputsFormCardAccordionDetails", children: [
          /* @__PURE__ */ jsx(
            RadioGroup,
            {
              "aria-labelledby": "demo-radio-buttons-group-label",
              name: "radio-buttons-group",
              value: selectedItem,
              onChange: onItemSelection,
              required,
              children: contentJsx
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "tripsInputsFormCardAccordionAddNewFieldContainer",
              onClick: handleOpenAddItemDialog,
              style: showDialog ? { display: "flex" } : { display: "none" },
              children: [
                /* @__PURE__ */ jsx("div", { className: "tripsInputsFormCardAccordionAddNewFieldIconContainer", children: "+" }),
                /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardAccordionAddNewFieldText", children: "Add new one" })
              ]
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ jsx(FormHelperText, { children: errorMessage })
    ] }),
    /* @__PURE__ */ jsx(
      GeneralInputDialog,
      {
        isOpen: isDialogOpen,
        onClose: handleCloseDialog,
        onAddFunction: handleAddItem,
        dialogTitle
      }
    )
  ] });
};
const LocationAccordion = ({
  selectedItem,
  onItemSelection,
  required = false,
  error = false,
  defaultContent,
  inputTitle,
  accordionTitle,
  //   dialogTitle,
  errorMessage,
  branch
  // New prop to determine branch
}) => {
  const [localContent, setLocalContent] = useState(defaultContent || []);
  useEffect(() => {
    const filteredContent = defaultContent ? defaultContent.filter((item) => !item.disabled) : [];
    setLocalContent(filteredContent);
  }, [defaultContent, inputTitle]);
  const handleCheckboxChange = (itemName) => {
    const currentSelections = Array.isArray(selectedItem) ? selectedItem : [];
    let updatedSelections;
    if (currentSelections.includes(itemName)) {
      updatedSelections = currentSelections.filter((name) => name !== itemName);
    } else {
      updatedSelections = [...currentSelections, itemName];
    }
    onItemSelection({ target: { value: updatedSelections } });
  };
  const contentJsx = localContent.filter((item) => !item.disabled).map((item, index) => {
    if (branch === "HO") {
      return /* @__PURE__ */ jsx(
        FormControlLabel,
        {
          label: item.name,
          className: "locationAccordionCheckboxContainer",
          control: /* @__PURE__ */ jsx(
            Checkbox,
            {
              checked: Array.isArray(selectedItem) && selectedItem.includes(item.name),
              onChange: () => handleCheckboxChange(item.name)
            }
          )
        },
        index
      );
    } else {
      return /* @__PURE__ */ jsx(
        FormControlLabel,
        {
          value: `${item.name}`,
          control: /* @__PURE__ */ jsx(Radio, {}),
          label: item.name
        },
        index
      );
    }
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: inputTitle }),
    /* @__PURE__ */ jsxs(FormControl, { error, fullWidth: true, children: [
      /* @__PURE__ */ jsxs(Accordion, { className: "tripsInputsFormCardAccordion", children: [
        /* @__PURE__ */ jsx(
          AccordionSummary,
          {
            expandIcon: /* @__PURE__ */ jsx(ExpandMoreIcon, {}),
            "aria-controls": "panel1-content",
            id: "panel1-header",
            children: /* @__PURE__ */ jsx(
              Typography$1,
              {
                className: "tripsInputsFormCardAccordionTitle",
                component: "span",
                children: accordionTitle
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(AccordionDetails, { className: "tripsInputsFormCardAccordionDetails", children: branch === "HO" ? /* @__PURE__ */ jsx("div", { children: contentJsx }) : /* @__PURE__ */ jsx(
          RadioGroup,
          {
            "aria-labelledby": "demo-radio-buttons-group-label",
            name: "radio-buttons-group",
            value: typeof selectedItem === "string" ? selectedItem : "",
            onChange: onItemSelection,
            required,
            children: contentJsx
          }
        ) })
      ] }),
      error && /* @__PURE__ */ jsx(FormHelperText, { children: errorMessage })
    ] })
  ] });
};
const BirthdayFormContext = createContext();
const useBirthdayFormContext = () => {
  const context = useContext(BirthdayFormContext);
  if (!context) {
    throw new Error(
      "useBirthdayFormContext must be used within a BirthdayFormProvider"
    );
  }
  return context;
};
function useBirthdayInputs() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    birthdayFormData,
    updateBirthdayFormData,
    resetBirthdayFormData,
    addNewAction,
    updateAction,
    removeAction,
    closeSnackbar
  } = useBirthdayFormContext();
  const { currentUser } = useUserAuth();
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
    paymentImage: false
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [expanded, setExpanded] = useState({
    basicInfo: true,
    kidsInfo: false,
    decorationExtras: false,
    foodBeverage: false,
    eventDetails: false
  });
  const [localSnackbar, setLocalSnackbar] = useState([]);
  const addSnackbarError = (message) => {
    const id = Date.now();
    console.log("Adding Snackbar error:", { id, message });
    setLocalSnackbar((prev) => [
      ...prev.filter((err) => err.message !== message),
      // Avoid duplicates
      { id, message, open: true }
    ]);
  };
  useEffect(() => {
    var _a;
    if ((_a = location.state) == null ? void 0 : _a.formData) {
      const formData = {
        ...location.state.formData,
        birthdayLocation: location.state.formData.birthdayBranch === "HO" ? Array.isArray(location.state.formData.birthdayLocation) ? location.state.formData.birthdayLocation : [location.state.formData.birthdayLocation] : typeof location.state.formData.birthdayLocation === "string" ? location.state.formData.birthdayLocation : ""
      };
      updateBirthdayFormData(formData);
      setIsEditMode(true);
      setEditId(location.state.formData.editId);
    } else {
      resetBirthdayFormData();
      setIsEditMode(false);
      setEditId(null);
    }
  }, [location.state]);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded((prev) => ({
      ...prev,
      [panel]: isExpanded
    }));
  };
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
  const calculateEndTime = (startTime) => {
    if (!startTime) return;
    try {
      const [hours, minutes] = startTime.split(":").map(Number);
      let totalHours = hours + 4;
      let endHours = totalHours % 24;
      const period = endHours >= 12 ? "PM" : "AM";
      endHours = endHours % 12 || 12;
      const formattedEndTime = `${endHours}:${minutes.toString().padStart(2, "0")} ${period}`;
      console.log("Event end time calculated:", formattedEndTime);
      updateBirthdayFormData({ endTime: formattedEndTime });
    } catch (error) {
      console.error("Error calculating event end time:", error);
    }
  };
  const convertTo24Hour = (timeStr, is12Hour = false, isEventEnd = false, eventStartMinutes = 0) => {
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
    if (isEventEnd && totalMinutes < eventStartMinutes) {
      totalMinutes += 24 * 60;
      console.log("Adjusted event end time for next day:", {
        timeStr,
        totalMinutes
      });
    }
    console.log("Converted to 24-hour:", { timeStr, totalMinutes });
    return totalMinutes;
  };
  const calculateActionEndTime = (actionId, startTime, duration) => {
    console.log("calculateActionEndTime - Input:", {
      actionId,
      startTime,
      duration,
      eventStartTime: birthdayFormData.startTime,
      eventEndTime: birthdayFormData.endTime
    });
    if (!startTime || !duration || !birthdayFormData.startTime || !birthdayFormData.endTime) {
      console.log("Missing required fields");
      return "";
    }
    try {
      const durationRegex = /^(\d+):([0-5]\d)$/;
      if (!durationRegex.test(duration)) {
        console.log("Invalid duration format:", duration);
        addSnackbarError("Invalid duration format. Use HH:MM (e.g., 1:45).");
        return "";
      }
      const [durationHours, durationMinutes] = duration.split(":").map(Number);
      if (isNaN(durationHours) || isNaN(durationMinutes)) {
        console.log("Invalid duration values:", {
          durationHours,
          durationMinutes
        });
        addSnackbarError("Invalid duration values. Use HH:MM (e.g., 1:45).");
        return "";
      }
      const totalDurationMinutes = durationHours * 60 + durationMinutes;
      const startTimeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
      if (!startTimeRegex.test(startTime)) {
        console.log("Invalid start time format:", startTime);
        addSnackbarError("Invalid start time format. Use HH:MM (e.g., 14:30).");
        return "";
      }
      const eventStartMinutes = convertTo24Hour(birthdayFormData.startTime);
      const actionStartMinutes = convertTo24Hour(startTime);
      const eventEndMinutes = convertTo24Hour(
        birthdayFormData.endTime,
        true,
        true,
        eventStartMinutes
      );
      if (eventStartMinutes === null || actionStartMinutes === null || eventEndMinutes === null) {
        console.log("Invalid time values detected");
        addSnackbarError("Invalid time values detected.");
        return "";
      }
      if (actionStartMinutes < eventStartMinutes || actionStartMinutes > eventEndMinutes) {
        console.log("Action start time out of event bounds:", {
          actionStartMinutes,
          eventStartMinutes,
          eventEndMinutes
        });
        addSnackbarError(
          `Action start time must be between ${birthdayFormData.startTime} and ${birthdayFormData.endTime}.`
        );
        return "";
      }
      let totalMinutes = actionStartMinutes + totalDurationMinutes;
      if (totalMinutes > eventEndMinutes) {
        console.log("Action end time exceeds event end time:", {
          totalMinutes,
          eventEndMinutes,
          startTime,
          duration,
          eventEndTime: birthdayFormData.endTime
        });
        addSnackbarError(
          `Action end time exceeds the birthday event end time (${birthdayFormData.endTime}). Please adjust the duration or start time.`
        );
        return "";
      }
      let endHours = Math.floor(totalMinutes / 60) % 24;
      let endMinutes = totalMinutes % 60;
      const period = endHours >= 12 ? "PM" : "AM";
      endHours = endHours % 12 || 12;
      const formattedEndTime = `${endHours}:${endMinutes.toString().padStart(2, "0")} ${period}`;
      console.log("Calculated end time:", formattedEndTime);
      return formattedEndTime;
    } catch (error) {
      console.error("Error calculating action end time:", error);
      addSnackbarError("Error processing duration. Use HH:MM (e.g., 1:45).");
      return "";
    }
  };
  const handleActionTimeChange = (actionId, field, value) => {
    console.log("handleActionTimeChange:", { actionId, field, value });
    const updates = { [field]: value };
    const action = birthdayFormData.actions.find((a) => a.id === actionId);
    if (field === "startTime" || field === "duration") {
      const startTime = field === "startTime" ? value : action.startTime;
      const duration = field === "duration" ? value : action.duration;
      const endTime = calculateActionEndTime(actionId, startTime, duration);
      updates.endTime = endTime;
      console.log("Updating action with:", { actionId, updates });
      updateAction(actionId, updates);
      const actionIndex = birthdayFormData.actions.findIndex(
        (a) => a.id === actionId
      );
      if (actionIndex < birthdayFormData.actions.length - 1 && endTime) {
        const nextActions = birthdayFormData.actions.slice(actionIndex + 1);
        nextActions.forEach((nextAction) => {
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
            newEndTime
          });
          updateAction(nextAction.id, {
            startTime: newStartTime,
            endTime: newEndTime
          });
        });
      }
    } else {
      updateAction(actionId, updates);
    }
    const errorKey = `${field}_${actionId}`;
    if (formErrors[errorKey]) {
      setFormErrors((prev) => ({ ...prev, [errorKey]: false }));
    }
  };
  useEffect(() => {
    if (birthdayFormData.startTime) {
      calculateEndTime(birthdayFormData.startTime);
    }
  }, [birthdayFormData.startTime]);
  const handleGenderChange = (e) => {
    updateBirthdayFormData({ gender: e.target.value });
    setFormErrors((prev) => ({ ...prev, gender: false }));
  };
  const handleBirthdayPackageSelection = (e) => {
    updateBirthdayFormData({ birthdayPackage: e.target.value });
    setFormErrors((prev) => ({ ...prev, birthdayPackage: false }));
  };
  const handleBirthdayExpectedAttendanceSelection = (e) => {
    updateBirthdayFormData({ birthdayExpectedAttendance: e.target.value });
    setFormErrors((prev) => ({ ...prev, birthdayExpectedAttendance: false }));
  };
  const handleBirthdayDecorationThemeSelection = (e) => {
    updateBirthdayFormData({ decorationTheme: e.target.value });
    setFormErrors((prev) => ({ ...prev, decorationTheme: false }));
  };
  const handleBirthdayBallonColorSelection = (e) => {
    updateBirthdayFormData({ ballonColor: e.target.value });
    setFormErrors((prev) => ({ ...prev, ballonColor: false }));
  };
  const handleBirthdayArtActivitiesSelection = (e) => {
    updateBirthdayFormData({ artActivities: e.target.value });
    setFormErrors((prev) => ({ ...prev, artActivities: false }));
  };
  const handleBirthdayAdditionalExtrasSelection = (e) => {
    updateBirthdayFormData({ additionalExtras: e.target.value });
    setFormErrors((prev) => ({ ...prev, additionalExtras: false }));
  };
  const handleBirthdayFBOutsourcingSelection = (e) => {
    updateBirthdayFormData({ FBOutsourcing: e.target.value });
    setFormErrors((prev) => ({ ...prev, FBOutsourcing: false }));
  };
  const handleBirthdayFBInHouseSelection = (e) => {
    updateBirthdayFormData({ FBInHouse: e.target.value });
    setFormErrors((prev) => ({ ...prev, FBInHouse: false }));
  };
  const handlePaymentStatusChange = (e) => {
    updateBirthdayFormData({ paymentStatus: e.target.value });
    setFormErrors((prev) => ({ ...prev, paymentStatus: false }));
  };
  const handleBirthdayPartyLeaderSelection = (e) => {
    updateBirthdayFormData({ partyLeader: e.target.value });
    setFormErrors((prev) => ({ ...prev, partyLeader: false }));
  };
  const handlePaymentImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBirthdayFormData({
          paymentImage: file,
          paymentImagePreview: reader.result
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
      paymentImagePreview: null
    });
  };
  const handleFeedbackImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBirthdayFormData({
          feedbackImage: file,
          feedbackImagePreview: reader.result
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
      feedbackImagePreview: null
    });
  };
  const handleSnackbarClose = (id) => {
    console.log("Snackbar closed manually for ID:", id);
    setLocalSnackbar((prev) => prev.filter((err) => err.id !== id));
    closeSnackbar();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setExpanded({
      basicInfo: true,
      kidsInfo: true,
      decorationExtras: true,
      foodBeverage: true,
      eventDetails: true
    });
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
      birthdayLocation: Array.isArray(birthdayFormData.birthdayLocation) ? birthdayFormData.birthdayLocation.length === 0 : !birthdayFormData.birthdayLocation,
      birthdayPackage: !birthdayFormData.birthdayPackage,
      paymentStatus: !birthdayFormData.paymentStatus,
      paidAmount: birthdayFormData.paymentStatus === "paid" && !birthdayFormData.paidAmount,
      paymentImage: birthdayFormData.paymentStatus === "paid" && !birthdayFormData.paymentImage
    };
    birthdayFormData.actions.forEach((action) => {
      if (action.value) {
        errors[`startTime_${action.id}`] = !action.startTime;
        errors[`duration_${action.id}`] = !action.duration;
      }
    });
    setFormErrors(errors);
    if (Object.values(errors).some((error) => error)) {
      setIsSubmitting(false);
      return;
    }
    try {
      const formData = new FormData();
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
        "startTimeOfEvent"
      ];
      formFields.forEach((field) => {
        if (birthdayFormData[field] !== void 0 && birthdayFormData[field] !== null) {
          formData.append(field, birthdayFormData[field]);
        }
      });
      if (Array.isArray(birthdayFormData.birthdayLocation)) {
        formData.append(
          "birthdayLocation",
          JSON.stringify(birthdayFormData.birthdayLocation)
        );
      } else {
        formData.append("birthdayLocation", birthdayFormData.birthdayLocation);
      }
      if (birthdayFormData.actions && birthdayFormData.actions.length > 0) {
        formData.append("actions", JSON.stringify(birthdayFormData.actions));
      }
      if (birthdayFormData.paymentImage) {
        formData.append("paymentImage", birthdayFormData.paymentImage);
      }
      if (birthdayFormData.feedbackImage) {
        formData.append("feedbackImage", birthdayFormData.feedbackImage);
      }
      console.log(
        "Form data prepared for submission:",
        Object.fromEntries(formData.entries())
      );
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      resetBirthdayFormData();
      navigate("/events", {
        state: {
          success: true,
          message: isEditMode ? "Birthday updated successfully" : "Birthday created successfully"
        }
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
      paymentImage: false
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
    handleSnackbarClose
  };
}
const EventDataContext = createContext();
const useEventData = () => {
  const context = useContext(EventDataContext);
  if (!context) {
    throw new Error("useEventData must be used within an EventDataProvider");
  }
  return context;
};
function useBirthdayLocations() {
  const { birthdayFormData, updateBirthdayFormData } = useBirthdayFormContext();
  const { currentUser } = useUserAuth();
  const { events } = useEventData();
  const locationOptions = {
    MOA: [
      { name: "Large Roof (Left & Right)" },
      { name: "Small Roof" },
      { name: "Pergola" },
      { name: "Treehouses" },
      { name: "Large Roof Left" },
      { name: "Large Roof Right" }
    ],
    HO: [
      { name: "Roof" },
      { name: "Pergola 1" },
      { name: "Pergola 2" },
      { name: "Pergola 3" },
      { name: "Pergola 4" },
      { name: "Extension" }
    ]
  };
  const [reservedLocations, setReservedLocations] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  useEffect(() => {
    if (currentUser) {
      let branches = [];
      if (currentUser.role === "admin") {
        branches = [{ name: "MOA" }, { name: "HO" }];
      } else if (currentUser.role === "MOA") {
        branches = [{ name: "MOA" }];
      } else if (currentUser.role === "HO") {
        branches = [{ name: "HO" }];
      } else {
        branches = [];
      }
      setAvailableBranches(branches);
      if (branches.length === 1 && !birthdayFormData.birthdayBranch) {
        updateBirthdayFormData({ birthdayBranch: branches[0].name });
      }
    }
  }, [currentUser, updateBirthdayFormData, birthdayFormData.birthdayBranch]);
  useEffect(() => {
    const today = /* @__PURE__ */ new Date();
    const formattedToday = `${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;
    if (birthdayFormData.birthdayBranch) {
      const dateToCheck = birthdayFormData.birthdayDate || formattedToday;
      fetchReservedLocations(dateToCheck);
    }
  }, [birthdayFormData.birthdayBranch, birthdayFormData.birthdayDate, events]);
  useEffect(() => {
    if (birthdayFormData.birthdayBranch) {
      const branch = birthdayFormData.birthdayBranch;
      const branchLocations = locationOptions[branch] || [];
      const locations = branchLocations.map((location) => {
        const isDisabled = isLocationDisabled(location.name, reservedLocations);
        return {
          ...location,
          disabled: isDisabled
        };
      });
      const availableLocs = locations.filter((loc) => !loc.disabled);
      setAvailableLocations(availableLocs);
      if (birthdayFormData.birthdayLocation) {
        if (branch === "HO") {
          const currentLocations = Array.isArray(
            birthdayFormData.birthdayLocation
          ) ? birthdayFormData.birthdayLocation : [birthdayFormData.birthdayLocation];
          const availableLocationNames = availableLocs.map((loc) => loc.name);
          const validLocations = currentLocations.filter(
            (loc) => availableLocationNames.includes(loc)
          );
          if (validLocations.length !== currentLocations.length && !isEditingCurrentLocation()) {
            updateBirthdayFormData({ birthdayLocation: validLocations });
          }
        } else {
          const isCurrentLocationAvailable = availableLocs.some(
            (loc) => loc.name === birthdayFormData.birthdayLocation
          );
          if (!isCurrentLocationAvailable && !isEditingCurrentLocation()) {
            updateBirthdayFormData({ birthdayLocation: "" });
          }
        }
      }
    }
  }, [birthdayFormData.birthdayBranch, reservedLocations]);
  const isEditingCurrentLocation = () => {
    if (birthdayFormData.id) {
      const currentEvent = events.find(
        (event) => event.id === birthdayFormData.id
      );
      if (currentEvent && currentEvent.birthdayDate === birthdayFormData.birthdayDate) {
        if (birthdayFormData.birthdayBranch === "HO") {
          const currentLocations = Array.isArray(currentEvent.birthdayLocation) ? currentEvent.birthdayLocation : [currentEvent.birthdayLocation];
          const formLocations = Array.isArray(birthdayFormData.birthdayLocation) ? birthdayFormData.birthdayLocation : [birthdayFormData.birthdayLocation];
          return currentLocations.length === formLocations.length && currentLocations.every((loc) => formLocations.includes(loc));
        } else {
          return currentEvent.birthdayLocation === birthdayFormData.birthdayLocation;
        }
      }
    }
    return false;
  };
  const formatDateToAPIFormat = (dateString) => {
    if (!dateString) return "";
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");
      return `${month}/${day}/${year}`;
    }
    const today = /* @__PURE__ */ new Date();
    return `${String(today.getMonth() + 1).padStart(2, "0")}/${String(
      today.getDate()
    ).padStart(2, "0")}/${today.getFullYear()}`;
  };
  const fetchReservedLocations = (selectedDate) => {
    try {
      if (!selectedDate) {
        const today = /* @__PURE__ */ new Date();
        selectedDate = `${String(today.getMonth() + 1).padStart(
          2,
          "0"
        )}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;
      }
      const formattedSelectedDate = formatDateToAPIFormat(selectedDate);
      const reservationsForDate = events.filter((event) => {
        if (!event.birthdayDate || !event.birthdayBranch || !event.birthdayLocation) {
          return false;
        }
        const eventDate = formatDateToAPIFormat(event.birthdayDate);
        return eventDate === formattedSelectedDate && event.birthdayBranch === birthdayFormData.birthdayBranch;
      }).flatMap((event) => {
        return Array.isArray(event.birthdayLocation) ? event.birthdayLocation : [event.birthdayLocation];
      });
      const updatedReservations = [...reservationsForDate];
      if (birthdayFormData.birthdayBranch === "MOA") {
        if (reservationsForDate.includes("Large Roof (Left & Right)")) {
          updatedReservations.push("Large Roof Left", "Large Roof Right");
        } else if (reservationsForDate.includes("Large Roof Left") && reservationsForDate.includes("Large Roof Right")) {
          updatedReservations.push("Large Roof (Left & Right)");
        }
      }
      setReservedLocations([...new Set(updatedReservations)]);
    } catch (error) {
      console.error("Error fetching reserved locations:", error);
      setReservedLocations([]);
    }
  };
  const isLocationDisabled = (locationName, reservations) => {
    if (isEditingCurrentLocation()) {
      return false;
    }
    if (reservations.includes(locationName)) {
      return true;
    }
    if (birthdayFormData.birthdayBranch === "MOA") {
      if (locationName === "Large Roof (Left & Right)" && (reservations.includes("Large Roof Left") || reservations.includes("Large Roof Right"))) {
        return true;
      }
      if ((locationName === "Large Roof Left" || locationName === "Large Roof Right") && reservations.includes("Large Roof (Left & Right)")) {
        return true;
      }
    }
    return false;
  };
  const handleBirthdayBranchSelection = (e) => {
    const newBranch = e.target.value;
    updateBirthdayFormData({
      birthdayBranch: newBranch,
      birthdayLocation: newBranch === "HO" ? [] : ""
      // Initialize as array for HO, string for MOA
    });
  };
  const handleBirthdayLocationSelection = (e) => {
    const value = e.target.value;
    if (birthdayFormData.birthdayBranch === "HO") {
      updateBirthdayFormData({ birthdayLocation: value });
    } else {
      updateBirthdayFormData({ birthdayLocation: value });
    }
  };
  return {
    availableBranches,
    availableLocations,
    reservedLocations,
    handleBirthdayBranchSelection,
    handleBirthdayLocationSelection
  };
}
function BirthdayInputs() {
  const location = useLocation();
  const {
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
    handleSnackbarClose
  } = useBirthdayInputs();
  const {
    availableBranches,
    availableLocations,
    handleBirthdayBranchSelection,
    handleBirthdayLocationSelection
  } = useBirthdayLocations();
  useEffect(() => {
    var _a;
    if ((_a = location.state) == null ? void 0 : _a.formData) ;
  }, [location.state]);
  const handleDurationInput = (e, actionId) => {
    const value = e.target.value;
    console.log("Duration input:", value);
    const durationRegex = /^(\d+):([0-5]\d)?$/;
    if (value && !durationRegex.test(value)) {
      e.target.setCustomValidity(
        "Please enter duration in HH:MM format (e.g., 1:45)"
      );
    } else {
      e.target.setCustomValidity("");
    }
    handleActionTimeChange(actionId, "duration", value);
  };
  return /* @__PURE__ */ jsxs("div", { className: "birthdayInputs", children: [
    /* @__PURE__ */ jsxs(Grid, { container: true, spacing: 5, children: [
      /* @__PURE__ */ jsx(Grid, { size: { xs: 12, md: 2.5 }, children: /* @__PURE__ */ jsx(SidebarNav, { activePage: "Birthdays" }) }),
      /* @__PURE__ */ jsxs(Grid, { size: { xs: 12, md: 9.5 }, children: [
        /* @__PURE__ */ jsx(BirthdayInfo, {}),
        submitError && /* @__PURE__ */ jsx("div", { className: "error-message", children: /* @__PURE__ */ jsx(Alert, { severity: "error", children: submitError }) }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "tripsInputsForm", noValidate: true, children: [
          /* @__PURE__ */ jsxs(
            Accordion,
            {
              expanded: expanded.basicInfo,
              onChange: handleAccordionChange("basicInfo"),
              children: [
                /* @__PURE__ */ jsx(
                  AccordionSummary,
                  {
                    expandIcon: /* @__PURE__ */ jsx(ExpandMoreIcon, {}),
                    "aria-controls": "basicInfo-content",
                    id: "basicInfo-header",
                    className: "outerAccordionSummary",
                    children: /* @__PURE__ */ jsx(Typography$1, { children: "Basic Information" })
                  }
                ),
                /* @__PURE__ */ jsxs(AccordionDetails, { className: "outerAccordionDetails", children: [
                  /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Birthday Name" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        name: "birthdayName",
                        placeholder: "Enter birthday name",
                        className: `tripsInputsFormCardInp`,
                        value: birthdayFormData.birthdayName || "",
                        onChange: handleInputChange,
                        required: true
                      }
                    ),
                    formErrors.birthdayName && /* @__PURE__ */ jsx("p", { className: "error-message", children: "Please enter a birthday name" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Client Name" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        name: "clientName",
                        placeholder: "Enter client name",
                        className: "tripsInputsFormCardInp",
                        value: birthdayFormData.clientName || "",
                        onChange: handleInputChange,
                        required: true
                      }
                    ),
                    formErrors.clientName && /* @__PURE__ */ jsx("p", { className: "error-message", children: "Please enter a client name" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Client Number" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        name: "clientNumber",
                        placeholder: "Enter client number",
                        className: "tripsInputsFormCardInp",
                        value: birthdayFormData.clientNumber || "",
                        onChange: handleInputChange,
                        required: true
                      }
                    ),
                    formErrors.clientNumber && /* @__PURE__ */ jsx("p", { className: "error-message", children: "Please enter a client number" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Birthday Date" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "date",
                        name: "birthdayDate",
                        placeholder: "Enter date of birthday",
                        className: "tripsInputsFormCardInp",
                        value: birthdayFormData.birthdayDate || "",
                        onChange: handleInputChange,
                        required: true
                      }
                    ),
                    formErrors.birthdayDate && /* @__PURE__ */ jsx("p", { className: "error-message", children: "Please enter a birthday date" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Start Time" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "time",
                        name: "startTime",
                        placeholder: "HH:MM (e.g., 14:30)",
                        className: "tripsInputsFormCardInp",
                        value: birthdayFormData.startTime || "",
                        onChange: handleInputChange,
                        required: true
                      }
                    ),
                    formErrors.startTime && /* @__PURE__ */ jsx("p", { className: "error-message", children: "Please enter the start time" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Duration" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        name: "duration",
                        placeholder: "4 hours",
                        className: "tripsInputsFormCardInp",
                        value: birthdayFormData.duration || "4 hours",
                        onChange: handleInputChange,
                        required: true,
                        disabled: true
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "End Time" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        name: "endTime",
                        placeholder: "After 4 hours of the start time",
                        className: "tripsInputsFormCardInp",
                        value: birthdayFormData.endTime || "",
                        onChange: handleInputChange,
                        required: true,
                        readOnly: true,
                        disabled: true
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Accordion,
            {
              expanded: expanded.kidsInfo,
              onChange: handleAccordionChange("kidsInfo"),
              children: [
                /* @__PURE__ */ jsx(
                  AccordionSummary,
                  {
                    expandIcon: /* @__PURE__ */ jsx(ExpandMoreIcon, {}),
                    "aria-controls": "kidsInfo-content",
                    id: "kidsInfo-header",
                    className: "outerAccordionSummary",
                    children: /* @__PURE__ */ jsx(Typography$1, { children: "Kids Information" })
                  }
                ),
                /* @__PURE__ */ jsxs(AccordionDetails, { className: "outerAccordionDetails", children: [
                  /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Birthday Kid/s Count" }),
                    /* @__PURE__ */ jsx(
                      BirthdayKidsCount,
                      {
                        name: "birthdayKidsCount",
                        value: birthdayFormData.birthdayKidsCount || "",
                        onChange: handleInputChange,
                        placeholder: "Enter kids count",
                        required: true
                      }
                    ),
                    formErrors.birthdayKidsCount && /* @__PURE__ */ jsx("p", { className: "error-message", children: "Please enter the kids count" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Kid/s Name" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        name: "kidName",
                        placeholder: "Enter kid/s Name",
                        className: "tripsInputsFormCardInp",
                        value: birthdayFormData.kidName || "",
                        onChange: handleInputChange,
                        required: true
                      }
                    ),
                    formErrors.kidName && /* @__PURE__ */ jsx("p", { className: "error-message", children: "Please enter the kid name" })
                  ] }),
                  /* @__PURE__ */ jsxs(FormControl, { children: [
                    /* @__PURE__ */ jsx(FormLabel, { className: "tripsInputsFormCardLabel", children: "Kid's gender" }),
                    /* @__PURE__ */ jsxs(
                      RadioGroup,
                      {
                        row: true,
                        name: "gender",
                        value: birthdayFormData.gender || "",
                        onChange: handleGenderChange,
                        className: "tripsInputsFormCardPayment",
                        children: [
                          /* @__PURE__ */ jsx(
                            FormControlLabel,
                            {
                              value: "boy",
                              control: /* @__PURE__ */ jsx(Radio, {}),
                              label: "Boy"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            FormControlLabel,
                            {
                              value: "girl",
                              control: /* @__PURE__ */ jsx(Radio, {}),
                              label: "Girl"
                            }
                          )
                        ]
                      }
                    ),
                    formErrors.gender && /* @__PURE__ */ jsx(FormHelperText$1, { error: true, children: "Please select a gender" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Kid's birthday" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "date",
                        name: "kidBirthday",
                        placeholder: "Enter date of kid's birthday",
                        className: "tripsInputsFormCardInp",
                        value: birthdayFormData.kidBirthday || "",
                        onChange: handleInputChange,
                        required: true
                      }
                    ),
                    formErrors.kidBirthday && /* @__PURE__ */ jsx("p", { className: "error-message", children: "Please enter the kid birthday" })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Accordion,
            {
              expanded: expanded.decorationExtras,
              onChange: handleAccordionChange("decorationExtras"),
              children: [
                /* @__PURE__ */ jsx(
                  AccordionSummary,
                  {
                    expandIcon: /* @__PURE__ */ jsx(ExpandMoreIcon, {}),
                    "aria-controls": "decorationExtras-content",
                    id: "decorationExtras-header",
                    className: "outerAccordionSummary",
                    children: /* @__PURE__ */ jsx(Typography$1, { children: "Decoration & Extras" })
                  }
                ),
                /* @__PURE__ */ jsxs(AccordionDetails, { className: "outerAccordionDetails", children: [
                  /* @__PURE__ */ jsx(
                    GeneralAccordion,
                    {
                      selectedItem: birthdayFormData.decorationTheme,
                      onItemSelection: handleBirthdayDecorationThemeSelection,
                      required: false,
                      error: formErrors.decorationTheme,
                      defaultContent: [{ name: "Theme 1" }, { name: "Theme 2" }],
                      inputTitle: "Decoration theme",
                      accordionTitle: birthdayFormData.decorationTheme ? `${birthdayFormData.decorationTheme}` : "Choose a theme",
                      dialogTitle: "Add New Theme",
                      errorMessage: "please select a decoration theme"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    GeneralAccordion,
                    {
                      selectedItem: birthdayFormData.ballonColor,
                      onItemSelection: handleBirthdayBallonColorSelection,
                      required: false,
                      error: formErrors.ballonColor,
                      defaultContent: [
                        { name: "red" },
                        { name: "green" },
                        { name: "blue" }
                      ],
                      inputTitle: "Ballon Color",
                      accordionTitle: birthdayFormData.ballonColor ? `${birthdayFormData.ballonColor}` : "Choose a color",
                      dialogTitle: "Add New Color",
                      errorMessage: "please select a ballon color"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    GeneralAccordion,
                    {
                      selectedItem: birthdayFormData.artActivities,
                      onItemSelection: handleBirthdayArtActivitiesSelection,
                      required: false,
                      error: formErrors.artActivities,
                      defaultContent: [
                        { name: "Activity 1" },
                        { name: "Activity 2" }
                      ],
                      inputTitle: "Art Activities",
                      accordionTitle: birthdayFormData.artActivities ? `${birthdayFormData.artActivities}` : "Choose an activity",
                      dialogTitle: "Add New Activity",
                      errorMessage: "please select the art activity"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    GeneralAccordion,
                    {
                      selectedItem: birthdayFormData.additionalExtras,
                      onItemSelection: handleBirthdayAdditionalExtrasSelection,
                      required: false,
                      error: formErrors.additionalExtras,
                      defaultContent: [{ name: "Extra 1" }, { name: "Extra 2" }],
                      inputTitle: "Additional Extras",
                      accordionTitle: birthdayFormData.additionalExtras ? `${birthdayFormData.additionalExtras}` : "Choose an additional extras",
                      dialogTitle: "Add New Additional Extras",
                      errorMessage: "please select the additional extras"
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Accordion,
            {
              expanded: expanded.foodBeverage,
              onChange: handleAccordionChange("foodBeverage"),
              children: [
                /* @__PURE__ */ jsx(
                  AccordionSummary,
                  {
                    expandIcon: /* @__PURE__ */ jsx(ExpandMoreIcon, {}),
                    "aria-controls": "foodBeverage-content",
                    id: "foodBeverage-header",
                    className: "outerAccordionSummary",
                    children: /* @__PURE__ */ jsx(Typography$1, { children: "Food & Beverage" })
                  }
                ),
                /* @__PURE__ */ jsxs(AccordionDetails, { className: "outerAccordionDetails", children: [
                  /* @__PURE__ */ jsx(
                    GeneralAccordion,
                    {
                      selectedItem: birthdayFormData.FBOutsourcing,
                      onItemSelection: handleBirthdayFBOutsourcingSelection,
                      required: false,
                      error: formErrors.FBOutsourcing,
                      defaultContent: [{ name: "Option 1" }, { name: "Option 2" }],
                      inputTitle: "F&B (Out Sourced)",
                      accordionTitle: birthdayFormData.FBOutsourcing ? `${birthdayFormData.FBOutsourcing}` : "Choose F&B (Out Sourced)",
                      dialogTitle: "Add New Option",
                      errorMessage: "please select the F&B (Out Sourced)"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    GeneralAccordion,
                    {
                      selectedItem: birthdayFormData.FBInHouse,
                      onItemSelection: handleBirthdayFBInHouseSelection,
                      required: false,
                      error: formErrors.FBInHouse,
                      defaultContent: [{ name: "Option 1" }, { name: "Option 2" }],
                      inputTitle: "F&B in House",
                      accordionTitle: birthdayFormData.FBInHouse ? `${birthdayFormData.FBInHouse}` : "Choose F&B in House",
                      dialogTitle: "Add New Option",
                      errorMessage: "please select the F&B (In House)"
                    }
                  ),
                  /* @__PURE__ */ jsxs(FormControl, { children: [
                    /* @__PURE__ */ jsxs(
                      RadioGroup,
                      {
                        row: true,
                        name: "paymentStatus",
                        value: birthdayFormData.paymentStatus || "",
                        onChange: handlePaymentStatusChange,
                        className: "tripsInputsFormCardPayment",
                        children: [
                          /* @__PURE__ */ jsx(
                            FormControlLabel,
                            {
                              value: "paid",
                              control: /* @__PURE__ */ jsx(Radio, {}),
                              label: "Paid"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            FormControlLabel,
                            {
                              value: "unpaid",
                              control: /* @__PURE__ */ jsx(Radio, {}),
                              label: "Unpaid"
                            }
                          )
                        ]
                      }
                    ),
                    formErrors.paymentStatus && /* @__PURE__ */ jsx(FormHelperText$1, { error: true, children: "Please select a payment status" })
                  ] }),
                  birthdayFormData.paymentStatus === "paid" && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                      /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Paid Amount" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          name: "paidAmount",
                          placeholder: "Enter the paid amount",
                          className: "tripsInputsFormCardInp",
                          value: birthdayFormData.paidAmount || "",
                          onChange: handleInputChange,
                          required: true
                        }
                      ),
                      formErrors.paidAmount && /* @__PURE__ */ jsx("p", { className: "error-message", children: "Please enter the paid amount" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                      /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Payment Image" }),
                      /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: "tripsInputsPaymentImageContainer",
                          onClick: handlePaymentImageClick,
                          children: [
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                id: "paymentImageUpload",
                                type: "file",
                                accept: "image/*",
                                style: { display: "none" },
                                onChange: handlePaymentImageChange
                              }
                            ),
                            birthdayFormData.paymentImagePreview ? /* @__PURE__ */ jsx("div", { className: "paymentImagePreviewContainer", children: /* @__PURE__ */ jsxs("div", { className: "paymentImagePreviewImgContainer", children: [
                              /* @__PURE__ */ jsx(
                                "img",
                                {
                                  src: birthdayFormData.paymentImagePreview,
                                  alt: "Payment Preview",
                                  className: "paymentImagePreview"
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "button",
                                {
                                  onClick: handleDeletePaymentImage,
                                  className: "deletePaymentImageButton",
                                  children: /* @__PURE__ */ jsx(CloseIcon, { className: "deletePaymentImageButtonIcon" })
                                }
                              )
                            ] }) }) : /* @__PURE__ */ jsxs("div", { className: "tripsInputsPaymentImageDragContainer", children: [
                              /* @__PURE__ */ jsx("div", { className: "tripsInputsPaymentImageDragImgWrapper", children: /* @__PURE__ */ jsx(
                                "img",
                                {
                                  src: "/assets/tripAssets/aboutUsBrowse.svg",
                                  alt: "",
                                  className: "tripsInputsPaymentImageDragImg"
                                }
                              ) }),
                              /* @__PURE__ */ jsx("p", { className: "tripsInputsPaymentImageDragText", children: "Drag & Drop here" }),
                              "or",
                              /* @__PURE__ */ jsx("p", { className: "tripsInputsPaymentImageBrowseText", children: "Browse Files to upload" })
                            ] })
                          ]
                        }
                      ),
                      formErrors.paymentImage && /* @__PURE__ */ jsx(FormHelperText$1, { error: true, children: "Please upload the payment image" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                      /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Remarks of Payment" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          name: "remarksOfPayment",
                          placeholder: "type here...",
                          className: "tripsInputsFormCardInp",
                          value: birthdayFormData.remarksOfPayment || "",
                          onChange: handleInputChange
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Feedback" }),
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "tripsInputsPaymentImageContainer",
                        onClick: handleFeedbackImageClick,
                        children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              id: "feedbackImageUpload",
                              type: "file",
                              accept: "image/*",
                              style: { display: "none" },
                              onChange: handleFeedbackImageChange
                            }
                          ),
                          birthdayFormData.feedbackImagePreview ? /* @__PURE__ */ jsx("div", { className: "paymentImagePreviewContainer", children: /* @__PURE__ */ jsxs("div", { className: "paymentImagePreviewImgContainer", children: [
                            /* @__PURE__ */ jsx(
                              "img",
                              {
                                src: birthdayFormData.feedbackImagePreview,
                                alt: "Feedback Preview",
                                className: "paymentImagePreview"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                onClick: handleDeleteFeedbackImage,
                                className: "deletePaymentImageButton",
                                children: /* @__PURE__ */ jsx(CloseIcon, { className: "deletePaymentImageButtonIcon" })
                              }
                            )
                          ] }) }) : /* @__PURE__ */ jsxs("div", { className: "tripsInputsPaymentImageDragContainer", children: [
                            /* @__PURE__ */ jsx("div", { className: "tripsInputsPaymentImageDragImgWrapper", children: /* @__PURE__ */ jsx(
                              "img",
                              {
                                src: "/assets/tripAssets/aboutUsBrowse.svg",
                                alt: "",
                                className: "tripsInputsPaymentImageDragImg"
                              }
                            ) }),
                            /* @__PURE__ */ jsx("p", { className: "tripsInputsPaymentImageDragText", children: "Add Feedback Image" }),
                            /* @__PURE__ */ jsx("p", { className: "tripsInputsPaymentImageDragText", children: "Drag & Drop here" }),
                            "or",
                            /* @__PURE__ */ jsx("p", { className: "tripsInputsPaymentImageBrowseText", children: "Browse Files to upload" })
                          ] })
                        ]
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Accordion,
            {
              expanded: expanded.eventDetails,
              onChange: handleAccordionChange("eventDetails"),
              children: [
                /* @__PURE__ */ jsx(
                  AccordionSummary,
                  {
                    expandIcon: /* @__PURE__ */ jsx(ExpandMoreIcon, {}),
                    "aria-controls": "panel5a-content",
                    id: "panel5a-header",
                    className: "outerAccordionSummary",
                    children: /* @__PURE__ */ jsx(Typography$1, { children: "Event Details" })
                  }
                ),
                /* @__PURE__ */ jsxs(AccordionDetails, { className: "outerAccordionDetails", children: [
                  /* @__PURE__ */ jsx(
                    GeneralAccordion,
                    {
                      selectedItem: birthdayFormData.birthdayBranch,
                      onItemSelection: handleBirthdayBranchSelection,
                      required: true,
                      error: formErrors.birthdayBranch,
                      defaultContent: availableBranches,
                      inputTitle: "Branch",
                      accordionTitle: birthdayFormData.birthdayBranch ? `${birthdayFormData.birthdayBranch}` : "Choose a branch",
                      dialogTitle: "Add New Branch",
                      errorMessage: "please select the branch",
                      showDialog: false
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    LocationAccordion,
                    {
                      selectedItem: birthdayFormData.birthdayLocation,
                      onItemSelection: handleBirthdayLocationSelection,
                      required: true,
                      error: formErrors.birthdayLocation,
                      defaultContent: availableLocations,
                      inputTitle: "Locations",
                      accordionTitle: birthdayFormData.birthdayLocation ? Array.isArray(birthdayFormData.birthdayLocation) ? birthdayFormData.birthdayLocation.join(", ") || "Choose locations" : `${birthdayFormData.birthdayLocation}` || "Choose a location" : "Choose a location",
                      errorMessage: "please select the location",
                      branch: birthdayFormData.birthdayBranch
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    GeneralAccordion,
                    {
                      selectedItem: birthdayFormData.birthdayPackage,
                      onItemSelection: handleBirthdayPackageSelection,
                      required: true,
                      error: formErrors.birthdayPackage,
                      defaultContent: [
                        { name: " Basic" },
                        { name: " Deluxe" },
                        { name: " Premium" },
                        { name: " Weekdays" }
                      ],
                      inputTitle: "Package",
                      accordionTitle: birthdayFormData.birthdayPackage ? `${birthdayFormData.birthdayPackage}` : "Choose a Package",
                      dialogTitle: "Add New Package",
                      errorMessage: "please select the package"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    GeneralAccordion,
                    {
                      selectedItem: birthdayFormData.birthdayExpectedAttendance,
                      onItemSelection: handleBirthdayExpectedAttendanceSelection,
                      required: false,
                      error: formErrors.birthdayExpectedAttendance,
                      defaultContent: [
                        { name: "Attendance 1" },
                        { name: "Attendance 2" }
                      ],
                      inputTitle: "Expected Attendance",
                      accordionTitle: birthdayFormData.birthdayExpectedAttendance ? `${birthdayFormData.birthdayExpectedAttendance}` : "Choose a attendance",
                      dialogTitle: "Add New Attendance",
                      errorMessage: "please select the expected attendance"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    GeneralAccordion,
                    {
                      selectedItem: birthdayFormData.partyLeader,
                      onItemSelection: handleBirthdayPartyLeaderSelection,
                      required: false,
                      error: formErrors.partyLeader,
                      defaultContent: [{ name: "Leader 1" }, { name: "Leader 2" }],
                      inputTitle: "Party leader",
                      accordionTitle: birthdayFormData.partyLeader ? `${birthdayFormData.partyLeader}` : "Choose the party leader",
                      dialogTitle: "Add New Leader",
                      errorMessage: "please select the party leader"
                    }
                  ),
                  birthdayFormData.actions.map((action, index) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "birthdaysFormActionsAndAddAction",
                      children: [
                        index > 0 && /* @__PURE__ */ jsx("div", { className: "birthdaysFormActionsAndAddActionBtnContainer", children: /* @__PURE__ */ jsx(
                          DeleteIcon,
                          {
                            className: "birthdaysFormActionsAndAddActionBtn",
                            onClick: () => removeAction(action.id),
                            style: { color: "red", cursor: "pointer" }
                          }
                        ) }),
                        /* @__PURE__ */ jsx(
                          GeneralAccordion,
                          {
                            selectedItem: action.value,
                            onItemSelection: (e) => updateAction(action.id, { value: e.target.value }),
                            required: false,
                            error: formErrors[`action${index + 1}`],
                            defaultContent: [
                              { name: "Action 1" },
                              { name: "Action 2" }
                            ],
                            inputTitle: `Action ${index + 1}`,
                            accordionTitle: action.value ? `${action.value}` : "Choose an Action",
                            dialogTitle: "Add New Action",
                            errorMessage: "please select this action"
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                          /* @__PURE__ */ jsxs("p", { className: "tripsInputsFormCardLabel", children: [
                            "Start Time of Action ",
                            index + 1
                          ] }),
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "time",
                              name: `startTime_${action.id}`,
                              placeholder: "HH:MM (e.g., 17:50)",
                              className: "tripsInputsFormCardInp",
                              value: action.startTime || "",
                              onChange: (e) => handleActionTimeChange(
                                action.id,
                                "startTime",
                                e.target.value
                              )
                            }
                          ),
                          formErrors[`startTime_${action.id}`] && /* @__PURE__ */ jsx("p", { className: "error-message", children: "Please enter start time for this action" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                          /* @__PURE__ */ jsxs("p", { className: "tripsInputsFormCardLabel", children: [
                            "Duration of Action ",
                            index + 1
                          ] }),
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "text",
                              name: `duration_${action.id}`,
                              placeholder: "HH:MM (e.g., 1:45)",
                              pattern: "\\d+:[0-5]\\d",
                              title: "Enter duration in HH:MM format (e.g., 1:45)",
                              className: "tripsInputsFormCardInp",
                              value: action.duration || "",
                              onInput: (e) => handleDurationInput(e, action.id)
                            }
                          ),
                          formErrors[`duration_${action.id}`] && /* @__PURE__ */ jsx("p", { className: "error-message", children: "Please enter duration in HH:MM format (e.g., 1:45)" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                          /* @__PURE__ */ jsxs("p", { className: "tripsInputsFormCardLabel", children: [
                            "End Time of Action ",
                            index + 1
                          ] }),
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "text",
                              name: `endTime_${action.id}`,
                              placeholder: "Auto-calculated",
                              className: "tripsInputsFormCardInp",
                              value: action.endTime || "",
                              disabled: true,
                              readOnly: true
                            }
                          )
                        ] })
                      ]
                    },
                    action.id
                  )),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "outlined",
                      startIcon: /* @__PURE__ */ jsx(AddIcon, {}),
                      onClick: addNewAction,
                      style: { marginTop: "15px" },
                      children: "Add Action"
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormSubmitAndCancel", children: [
            /* @__PURE__ */ jsx("div", { className: "tripsInputsFormSubmitBtnContainer", children: /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                variant: "contained",
                className: "tripsInputsFormSubmitBtn",
                style: {
                  backgroundColor: birthdayFormData.paymentStatus === "unpaid" ? "#FF181C" : "#44a047"
                },
                disabled: isSubmitting,
                children: isSubmitting ? "Processing..." : isEditMode ? "Update" : "Save"
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "tripsInputsFormCancelContainer", children: /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outlined",
                className: "tripsInputsFormCancel",
                onClick: handleCancel,
                disabled: isSubmitting,
                children: "Cancel"
              }
            ) })
          ] })
        ] })
      ] })
    ] }),
    localSnackbar.map((snack, index) => /* @__PURE__ */ jsx(
      Snackbar,
      {
        open: snack.open,
        autoHideDuration: 6e3,
        onClose: () => handleSnackbarClose(snack.id),
        anchorOrigin: { vertical: "bottom", horizontal: "center" },
        sx: { bottom: `${24 + index * 60}px` },
        children: /* @__PURE__ */ jsx(
          Alert,
          {
            severity: "error",
            action: /* @__PURE__ */ jsx(
              IconButton,
              {
                size: "small",
                "aria-label": "close",
                color: "inherit",
                onClick: () => handleSnackbarClose(snack.id),
                children: /* @__PURE__ */ jsx(CloseIcon, { fontSize: "small" })
              }
            ),
            sx: { width: "100%" },
            children: snack.message
          }
        )
      },
      snack.id
    ))
  ] });
}
function Birthday() {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(BirthdayInputs, {}) });
}
export {
  Birthday as default
};
