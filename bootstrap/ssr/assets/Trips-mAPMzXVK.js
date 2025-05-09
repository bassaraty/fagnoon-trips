import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useContext, createContext, useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText$1 from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography$1 from "@mui/material/Typography";
import { N as Navbar, S as SidebarNav } from "./Navbar-DpiuqVvx.js";
import { Breadcrumbs, Link, Typography, FormHelperText, TextField as TextField$1, InputAdornment, useTheme } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
const TripFormContext = createContext();
const useTripFormContext = () => {
  const context = useContext(TripFormContext);
  if (!context) {
    throw new Error(
      "useTripFormContext must be used within a TripFormProvider"
    );
  }
  return context;
};
function TripsInfo() {
  return /* @__PURE__ */ jsxs("div", { className: "tripsInfo", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "tripsInfoBreadcrumbsContainer", children: /* @__PURE__ */ jsxs(
      Breadcrumbs,
      {
        "aria-label": "breadcrumb",
        separator: "›",
        className: "tripsInfoBreadcrumbs",
        children: [
          /* @__PURE__ */ jsx(Link, { underline: "hover", color: "inherit", href: "/trips", children: "Trips" }),
          /* @__PURE__ */ jsx(Typography, { style: { color: "#4b4b4b !important" }, children: "Home" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("h1", { className: "tripsInfoTitle", children: "Trips Creation" })
  ] });
}
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
  errorMessage
}) => {
  const [localContent, setLocalContent] = useState(defaultContent || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    setLocalContent(defaultContent || []);
  }, [defaultContent]);
  const handleOpenAddItemDialog = () => {
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const handleAddItem = (newState) => {
    setLocalContent([...localContent, { name: newState }]);
    setIsDialogOpen(false);
  };
  const contentJsx = localContent.map((item, index) => /* @__PURE__ */ jsx(
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
const SchoolGradeInput = ({ name, value, onChange, placeholder, required }) => {
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
const AddSchoolDialog = ({ isOpen, onClose, onAddSchool }) => {
  const [newSchoolName, setNewSchoolName] = useState("");
  const handleAddSchool = () => {
    if (newSchoolName.trim()) {
      onAddSchool(newSchoolName.trim());
      setNewSchoolName("");
    }
  };
  const handleClose = () => {
    onClose();
    setNewSchoolName("");
  };
  return /* @__PURE__ */ jsxs(Dialog, { open: isOpen, onClose: handleClose, children: [
    /* @__PURE__ */ jsx(DialogTitle, { children: "Add New School" }),
    /* @__PURE__ */ jsx(DialogContent, { children: /* @__PURE__ */ jsx(
      TextField,
      {
        autoFocus: true,
        margin: "dense",
        label: "School Name",
        type: "text",
        fullWidth: true,
        variant: "standard",
        value: newSchoolName,
        onChange: (e) => setNewSchoolName(e.target.value)
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogActions, { children: [
      /* @__PURE__ */ jsx(Button, { onClick: handleClose, children: "Cancel" }),
      /* @__PURE__ */ jsx(Button, { onClick: handleAddSchool, children: "Add" })
    ] })
  ] });
};
const DEFAULT_SCHOOL_NAMES = [
  { name: "School 1" },
  { name: "School 2" },
  { name: "School 3" }
];
const SchoolNameAccordion = ({
  selectedSchool,
  onSchoolSelection,
  required = false,
  error = false,
  // eslint-disable-next-line no-unused-vars
  onAddSchool
}) => {
  const [schoolNames, setSchoolNames] = useState(DEFAULT_SCHOOL_NAMES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleOpenAddSchoolDialog = () => {
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const handleAddSchoolName = (newSchoolName) => {
    setSchoolNames([...schoolNames, { name: newSchoolName }]);
    setIsDialogOpen(false);
  };
  const filteredSchools = useMemo(() => {
    return schoolNames.filter(
      (item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [schoolNames, searchTerm]);
  const schoolNamesJsx = filteredSchools.map((item, index) => /* @__PURE__ */ jsx(
    FormControlLabel,
    {
      value: `${item.name}`,
      control: /* @__PURE__ */ jsx(Radio, {}),
      label: item.name
    },
    index
  ));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Company/School Name" }),
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
                children: selectedSchool ? `${selectedSchool}` : "Enter / Choose school name"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs(AccordionDetails, { className: "tripsInputsFormCardAccordionDetails", children: [
          /* @__PURE__ */ jsx(
            TextField$1,
            {
              fullWidth: true,
              variant: "outlined",
              placeholder: "Search schools",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              InputProps: {
                startAdornment: /* @__PURE__ */ jsx(InputAdornment, { position: "start", children: /* @__PURE__ */ jsx(SearchIcon, {}) }),
                sx: {
                  backgroundColor: "white",
                  marginBottom: "10px"
                }
              }
            }
          ),
          /* @__PURE__ */ jsx(
            RadioGroup,
            {
              "aria-labelledby": "demo-radio-buttons-group-label",
              name: "radio-buttons-group",
              value: selectedSchool,
              onChange: onSchoolSelection,
              required,
              children: schoolNamesJsx
            }
          ),
          filteredSchools.length === 0 && /* @__PURE__ */ jsx(
            Typography$1,
            {
              variant: "body2",
              color: "textSecondary",
              sx: { textAlign: "center", mt: 2 },
              children: "No schools found"
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "tripsInputsFormCardAccordionAddNewFieldContainer",
              onClick: handleOpenAddSchoolDialog,
              children: [
                /* @__PURE__ */ jsx("div", { className: "tripsInputsFormCardAccordionAddNewFieldIconContainer", children: "+" }),
                /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardAccordionAddNewFieldText", children: "Add new one" })
              ]
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ jsx(FormHelperText, { children: "Please select a school/company" })
    ] }),
    /* @__PURE__ */ jsx(
      AddSchoolDialog,
      {
        isOpen: isDialogOpen,
        onClose: handleCloseDialog,
        onAddSchool: handleAddSchoolName
      }
    )
  ] });
};
const TripChildrenAge = ({ name, value, onChange, placeholder, required }) => {
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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
function getStyles(name, selectedItems, theme) {
  return {
    fontWeight: selectedItems.includes(name) ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular
  };
}
const TripsExtraActivity = ({
  selectedItems = [],
  onItemsSelection,
  required = false,
  error = false,
  defaultContent,
  inputTitle,
  errorMessage
}) => {
  const theme = useTheme();
  const [initialState, setInitialState] = useState(defaultContent);
  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    const selectedValues = typeof value === "string" ? value.split(",") : value;
    onItemsSelection(selectedValues);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: inputTitle }),
    /* @__PURE__ */ jsxs(FormControl, { error, fullWidth: true, required, children: [
      /* @__PURE__ */ jsx(InputLabel, { id: "multiple-chip-label", children: "Select Activities" }),
      /* @__PURE__ */ jsx(
        Select,
        {
          labelId: "multiple-chip-label",
          id: "multiple-chip",
          multiple: true,
          disabled: true,
          value: selectedItems,
          onChange: handleChange,
          input: /* @__PURE__ */ jsx(
            OutlinedInput,
            {
              id: "select-multiple-chip",
              label: "Select Activities"
            }
          ),
          renderValue: (selected) => /* @__PURE__ */ jsx(Box, { sx: { display: "flex", flexWrap: "wrap", gap: 0.5 }, children: selected.map((value) => /* @__PURE__ */ jsx(Chip, { label: value }, value)) }),
          MenuProps,
          children: initialState.map((item, index) => /* @__PURE__ */ jsx(
            MenuItem,
            {
              value: item.name,
              style: getStyles(item.name, selectedItems, theme),
              children: item.name
            },
            index
          ))
        }
      ),
      error && /* @__PURE__ */ jsx(FormHelperText, { children: errorMessage })
    ] })
  ] });
};
const ACTIVITIES_OPTIONS = [
  "Pottery",
  "Wood Craving",
  "Planting",
  "Ola – Painting",
  "Tabla – Painting",
  "Drawing on Glass",
  "Drawing on Ceramic",
  "Sawdust",
  "Beads",
  "Weaving Carpets",
  "Printing - Tote Bag",
  "Mosaic",
  "Art Cutys",
  "Perfume",
  "Mirror – Beads"
];
function TripsInputs() {
  var _a;
  const location = useLocation();
  const navigate = useNavigate();
  const { tripFormData, updateTripFormData, resetTripFormData } = useTripFormContext();
  const [formErrors, setFormErrors] = useState({
    selectedSchool: false,
    selectedPackage: false,
    activity1: false,
    activity2: false,
    companyLocation: false,
    paymentStatus: false,
    paymentType: false,
    paidAmount: false,
    paymentImage: false,
    contactPerson: false,
    phoneNumber: false,
    numberOfGuests: false,
    date: false,
    startTime: false
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [expanded, setExpanded] = useState({
    basicInfo: true,
    packageInfo: false,
    activities: false
  });
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded((prev) => ({
      ...prev,
      [panel]: isExpanded
    }));
  };
  const hasBasicInfoErrors = () => {
    if (!showErrors) return false;
    return formErrors.selectedSchool || formErrors.date || formErrors.startTime;
  };
  const hasPackageInfoErrors = () => {
    if (!showErrors) return false;
    return formErrors.selectedPackage || formErrors.contactPerson || formErrors.phoneNumber || formErrors.numberOfGuests;
  };
  const hasActivitiesErrors = () => {
    if (!showErrors) return false;
    return formErrors.activity1 || tripFormData.selectedPackage === "Package 4" && formErrors.activity2 || formErrors.companyLocation || formErrors.paymentStatus || tripFormData.paymentStatus === "paid" && formErrors.paymentType || tripFormData.paymentStatus === "paid" && formErrors.paymentImage;
  };
  useEffect(() => {
    var _a2;
    if ((_a2 = location.state) == null ? void 0 : _a2.formData) {
      updateTripFormData(location.state.formData);
      setIsEditMode(true);
      setEditId(location.state.formData.editId);
    } else {
      resetTripFormData();
      setIsEditMode(false);
      setEditId(null);
    }
  }, [location.state]);
  const handlePackageSelection = (e) => {
    const selectedPackage = e.target.value;
    updateTripFormData({
      selectedPackage,
      // Reset activities when package changes
      activity1: "",
      activity2: "",
      // Set default extras based on package
      selectedExtras: getDefaultExtrasForPackage(selectedPackage)
    });
    if (showErrors) {
      setFormErrors((prev) => ({ ...prev, selectedPackage: false }));
    }
  };
  const getDefaultExtrasForPackage = (packageName) => {
    switch (packageName) {
      case "Package 1":
        return ["Donkey Ride", "Face Painting"];
      case "Package 2":
        return ["Donkey Ride", "Baking"];
      case "Package 3":
        return ["Donkey Ride", "Face Painting", "Baking"];
      case "Package 4":
        return ["Donkey Ride", "Baking"];
      default:
        return [];
    }
  };
  const getAvailableActivitiesForActivity1 = () => {
    if (tripFormData.selectedPackage === "Package 1") {
      return [{ name: "Color Fight" }];
    }
    return ACTIVITIES_OPTIONS.map((activity) => ({ name: activity }));
  };
  const getAvailableActivitiesForActivity2 = () => {
    if (tripFormData.selectedPackage !== "Package 4") {
      return [];
    }
    return ACTIVITIES_OPTIONS.map((activity) => ({ name: activity }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateTripFormData({ [name]: value });
    if (showErrors) {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }
    if (name === "startTime") {
      calculateEndTime(value);
    }
  };
  const convertTo12HourFormat = (hours, minutes) => {
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };
  const calculateEndTime = (startTime) => {
    if (!startTime) return;
    try {
      const [hours, minutes] = startTime.split(":").map(Number);
      let endHours = hours + 4;
      if (endHours >= 24) {
        endHours = endHours - 24;
      }
      const endTime12Hour = convertTo12HourFormat(endHours, minutes);
      updateTripFormData({ endTime: endTime12Hour });
    } catch (error) {
      console.error("Error calculating end time:", error);
    }
  };
  useEffect(() => {
    if (tripFormData.startTime) {
      calculateEndTime(tripFormData.startTime);
    }
  }, [tripFormData.startTime]);
  const handleSchoolSelection = (e) => {
    const selectedSchool = e.target.value;
    updateTripFormData({ selectedSchool });
    if (showErrors) {
      setFormErrors((prev) => ({ ...prev, selectedSchool: false }));
    }
  };
  const handleExtrasSelection = (selectedExtras) => {
    updateTripFormData({ selectedExtras });
    if (showErrors) {
      setFormErrors((prev) => ({ ...prev, selectedExtras: false }));
    }
  };
  const handleActivity1Selection = (e) => {
    const selectedActivity1 = e.target.value;
    updateTripFormData({ activity1: selectedActivity1 });
    if (showErrors) {
      setFormErrors((prev) => ({ ...prev, activity1: false }));
    }
  };
  const handleActivity2Selection = (e) => {
    const selectedActivity2 = e.target.value;
    updateTripFormData({ activity2: selectedActivity2 });
    if (showErrors) {
      setFormErrors((prev) => ({ ...prev, activity2: false }));
    }
  };
  const handleCompanyLocationSelection = (e) => {
    const selectedCompanyLocation = e.target.value;
    updateTripFormData({ companyLocation: selectedCompanyLocation });
    if (showErrors) {
      setFormErrors((prev) => ({ ...prev, companyLocation: false }));
    }
  };
  const handlePaymentStatusChange = (e) => {
    const paymentStatus = e.target.value;
    updateTripFormData({ paymentStatus });
    if (showErrors) {
      setFormErrors((prev) => ({ ...prev, paymentStatus: false }));
    }
  };
  const handleTripPaymentTypeSelection = (e) => {
    const selectedTripPaymentType = e.target.value;
    updateTripFormData({ paymentType: selectedTripPaymentType });
    if (showErrors) {
      setFormErrors((prev) => ({ ...prev, paymentType: false }));
    }
  };
  const handlePaymentImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateTripFormData({
          paymentImage: file,
          paymentImagePreview: reader.result
        });
        if (showErrors) {
          setFormErrors((prev) => ({ ...prev, paymentImage: false }));
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handlePaymentImageClick = () => {
    document.getElementById("tripPaymentImageUpload").click();
  };
  const handleDeletePaymentImage = (e) => {
    e.stopPropagation();
    updateTripFormData({
      paymentImage: null,
      paymentImagePreview: null
    });
  };
  const validateForm = () => {
    const newErrors = {
      selectedSchool: !tripFormData.selectedSchool,
      selectedPackage: !tripFormData.selectedPackage,
      paidAmount: !tripFormData.paidAmount,
      activity1: !tripFormData.activity1,
      activity2: tripFormData.selectedPackage === "Package 4" && !tripFormData.activity2,
      companyLocation: !tripFormData.companyLocation,
      paymentStatus: !tripFormData.paymentStatus,
      paymentType: tripFormData.paymentStatus === "paid" && !tripFormData.paymentType,
      paymentImage: tripFormData.paymentStatus === "paid" && !tripFormData.paymentImage,
      contactPerson: !tripFormData.contactPerson,
      phoneNumber: !tripFormData.phoneNumber,
      numberOfGuests: !tripFormData.numberOfGuests,
      date: !tripFormData.date,
      startTime: !tripFormData.startTime
    };
    setFormErrors(newErrors);
    setShowErrors(true);
    if (newErrors.selectedSchool || newErrors.date || newErrors.startTime) {
      setExpanded((prev) => ({ ...prev, basicInfo: true }));
    }
    if (newErrors.selectedPackage || newErrors.contactPerson || newErrors.phoneNumber || newErrors.numberOfGuests) {
      setExpanded((prev) => ({ ...prev, packageInfo: true }));
    }
    if (newErrors.activity1 || tripFormData.selectedPackage === "Package 4" && newErrors.activity2 || newErrors.companyLocation || newErrors.paymentStatus || tripFormData.paymentStatus === "paid" && newErrors.paymentType || tripFormData.paymentStatus === "paid" && newErrors.paymentImage) {
      setExpanded((prev) => ({ ...prev, activities: true }));
    }
    return !Object.values(newErrors).some((error) => error);
  };
  const handleSubmit = async (e) => {
    var _a2, _b;
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }
    try {
      const formData = new FormData();
      const tripData = {
        tripName: tripFormData.selectedSchool,
        schoolName: tripFormData.selectedSchool,
        tripDate: tripFormData.date,
        tripStartTime: tripFormData.startTime,
        tripDuration: tripFormData.duration,
        tripEndTime: tripFormData.endTime,
        tripPackage: tripFormData.selectedPackage,
        extras: tripFormData.selectedExtras,
        contactPerson: tripFormData.contactPerson,
        position: tripFormData.position,
        phoneNumber: tripFormData.phoneNumber,
        schoolGrade: tripFormData.schoolGrade,
        childrenAge: tripFormData.childrenAge,
        numberOfGuests: tripFormData.numberOfGuests,
        numberOfSupervisors: tripFormData.numberOfSupervisors,
        activity1: tripFormData.activity1,
        activity2: tripFormData.activity2,
        tripLocation: tripFormData.companyLocation,
        tripPaymentStatus: tripFormData.paymentStatus,
        paymentType: tripFormData.paymentType,
        paidAmount: tripFormData.paidAmount,
        notes: tripFormData.notes
      };
      Object.entries(tripData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (tripFormData.paymentImage) {
        formData.append("paymentImage", tripFormData.paymentImage);
      }
      console.log("Form data to be submitted:", {
        ...tripData,
        paymentImage: tripFormData.paymentImage ? "File attached" : "No file"
      });
      console.log(isEditMode ? "Updating trip..." : "Creating new trip...");
      let response;
      if (isEditMode) {
        formData.append("_method", "PUT");
        response = await fetch(`/api/trips/${tripFormData.editId}`, {
          // Use tripFormData.editId
          method: "POST",
          // Using POST with _method for FormData compatibility if needed, otherwise "PUT"
          body: formData,
          headers: {
            // "Content-Type": "multipart/form-data", // Don't set Content-Type, browser will do it for FormData
            "X-CSRF-TOKEN": (_a2 = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a2.getAttribute("content"),
            "Accept": "application/json"
          }
        });
      } else {
        response = await fetch("/api/trips", {
          method: "POST",
          body: formData,
          headers: {
            // "Content-Type": "multipart/form-data", // Don't set Content-Type, browser will do it for FormData
            "X-CSRF-TOKEN": (_b = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _b.getAttribute("content"),
            "Accept": "application/json"
          }
        });
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save trip");
      }
      const result = await response.json();
      console.log("Trip saved successfully:", result);
      resetTripFormData();
      setShowErrors(false);
      navigate("/events", { state: { success: true } });
    } catch (error) {
      console.error("Error saving trip:", error);
      setSubmitError(error.message || "Failed to save trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    resetTripFormData();
    setShowErrors(false);
    setFormErrors({
      selectedSchool: false,
      selectedPackage: false,
      activity1: false,
      activity2: false,
      companyLocation: false,
      paymentStatus: false,
      paymentType: false,
      paidAmount: false,
      paymentImage: false,
      contactPerson: false,
      phoneNumber: false,
      numberOfGuests: false,
      date: false,
      startTime: false
    });
  };
  return /* @__PURE__ */ jsx("div", { className: "tripsInputs", children: /* @__PURE__ */ jsxs(Grid, { container: true, spacing: 5, children: [
    /* @__PURE__ */ jsx(Grid, { size: { xs: 12, md: 2.5 }, children: /* @__PURE__ */ jsx(SidebarNav, { activePage: "Trips" }) }),
    /* @__PURE__ */ jsxs(Grid, { size: { xs: 12, md: 9.5 }, children: [
      /* @__PURE__ */ jsx(TripsInfo, {}),
      submitError && /* @__PURE__ */ jsx("div", { className: "error-message", children: /* @__PURE__ */ jsx(Alert, { severity: "error", children: submitError }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "tripsInputsForm", noValidate: true, children: [
        /* @__PURE__ */ jsxs(
          Accordion,
          {
            expanded: expanded.basicInfo,
            onChange: handleAccordionChange("basicInfo"),
            className: hasBasicInfoErrors() ? "accordion-with-error" : "",
            children: [
              /* @__PURE__ */ jsx(
                AccordionSummary,
                {
                  expandIcon: /* @__PURE__ */ jsx(ExpandMoreIcon, {}),
                  "aria-controls": "tripBasicInfo-content",
                  id: "tripBasicInfo-header",
                  className: "outerAccordionSummary",
                  children: /* @__PURE__ */ jsxs(Typography$1, { children: [
                    "Company/School Information",
                    " ",
                    hasBasicInfoErrors() && /* @__PURE__ */ jsx("span", { className: "error-indicator", children: "*" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxs(AccordionDetails, { className: "outerAccordionDetails", children: [
                /* @__PURE__ */ jsx(
                  SchoolNameAccordion,
                  {
                    selectedSchool: tripFormData.selectedSchool,
                    onSchoolSelection: handleSchoolSelection,
                    required: true,
                    error: showErrors && formErrors.selectedSchool
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                  /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Date" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "date",
                      name: "date",
                      className: `tripsInputsFormCardInp ${showErrors && formErrors.date ? "error-input" : ""}`,
                      value: tripFormData.date || "",
                      onChange: handleInputChange
                    }
                  ),
                  showErrors && formErrors.date && /* @__PURE__ */ jsx(FormHelperText$1, { error: true, children: "Date is required" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                  /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Start Time" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "time",
                      name: "startTime",
                      className: `tripsInputsFormCardInp ${showErrors && formErrors.startTime ? "error-input" : ""}`,
                      value: tripFormData.startTime || "",
                      onChange: handleInputChange
                    }
                  ),
                  showErrors && formErrors.startTime && /* @__PURE__ */ jsx(FormHelperText$1, { error: true, children: "Start time is required" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                  /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Duration" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      name: "duration",
                      className: "tripsInputsFormCardInp",
                      value: tripFormData.duration || "",
                      onChange: handleInputChange,
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
                      className: "tripsInputsFormCardInp",
                      value: tripFormData.endTime || "",
                      onChange: handleInputChange,
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
            expanded: expanded.packageInfo,
            onChange: handleAccordionChange("packageInfo"),
            className: hasPackageInfoErrors() ? "accordion-with-error" : "",
            children: [
              /* @__PURE__ */ jsx(
                AccordionSummary,
                {
                  expandIcon: /* @__PURE__ */ jsx(ExpandMoreIcon, {}),
                  "aria-controls": "tripPackageInfo-content",
                  id: "tripPackageInfo-header",
                  className: "outerAccordionSummary",
                  children: /* @__PURE__ */ jsxs(Typography$1, { children: [
                    "Contact Information",
                    hasPackageInfoErrors() && /* @__PURE__ */ jsx("span", { className: "error-indicator", children: "*" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxs(AccordionDetails, { className: "outerAccordionDetails", children: [
                /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                  /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Contact Person" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      name: "contactPerson",
                      className: `tripsInputsFormCardInp ${showErrors && formErrors.contactPerson ? "error-input" : ""}`,
                      value: tripFormData.contactPerson || "",
                      onChange: handleInputChange
                    }
                  ),
                  showErrors && formErrors.contactPerson && /* @__PURE__ */ jsx(FormHelperText$1, { error: true, children: "Contact person is required" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                  /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Position" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      name: "position",
                      className: "tripsInputsFormCardInp",
                      value: tripFormData.position || "",
                      onChange: handleInputChange
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                  /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Phone Number" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      name: "phoneNumber",
                      className: `tripsInputsFormCardInp ${showErrors && formErrors.phoneNumber ? "error-input" : ""}`,
                      value: tripFormData.phoneNumber || "",
                      onChange: handleInputChange
                    }
                  ),
                  showErrors && formErrors.phoneNumber && /* @__PURE__ */ jsx(FormHelperText$1, { error: true, children: "Phone number is required" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                  /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "School Grade" }),
                  /* @__PURE__ */ jsx(
                    SchoolGradeInput,
                    {
                      name: "schoolGrade",
                      value: tripFormData.schoolGrade || "",
                      onChange: handleInputChange
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                  /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Children Age" }),
                  /* @__PURE__ */ jsx(
                    TripChildrenAge,
                    {
                      name: "childrenAge",
                      value: tripFormData.childrenAge || "",
                      onChange: handleInputChange
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                  /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Number of Guests" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      name: "numberOfGuests",
                      className: `tripsInputsFormCardInp ${showErrors && formErrors.numberOfGuests ? "error-input" : ""}`,
                      value: tripFormData.numberOfGuests || "",
                      onChange: handleInputChange
                    }
                  ),
                  showErrors && formErrors.numberOfGuests && /* @__PURE__ */ jsx(FormHelperText$1, { error: true, children: "Number of guests is required" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                  /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Number of Supervisors" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      name: "numberOfSupervisors",
                      className: "tripsInputsFormCardInp",
                      value: tripFormData.numberOfSupervisors || "",
                      onChange: handleInputChange
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
            expanded: expanded.activities,
            onChange: handleAccordionChange("activities"),
            className: hasActivitiesErrors() ? "accordion-with-error" : "",
            children: [
              /* @__PURE__ */ jsx(
                AccordionSummary,
                {
                  expandIcon: /* @__PURE__ */ jsx(ExpandMoreIcon, {}),
                  "aria-controls": "activities-content",
                  id: "activities-header",
                  className: "outerAccordionSummary",
                  children: /* @__PURE__ */ jsxs(Typography$1, { children: [
                    "Packages & Activities & Payment",
                    hasActivitiesErrors() && /* @__PURE__ */ jsx("span", { className: "error-indicator", children: "*" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxs(AccordionDetails, { className: "outerAccordionDetails", children: [
                /* @__PURE__ */ jsx(
                  GeneralAccordion,
                  {
                    selectedItem: tripFormData.selectedPackage,
                    onItemSelection: handlePackageSelection,
                    required: true,
                    error: showErrors && formErrors.selectedPackage,
                    defaultContent: [
                      { name: "Package 1" },
                      { name: "Package 2" },
                      { name: "Package 3" },
                      { name: "Package 4" }
                    ],
                    inputTitle: "Package",
                    accordionTitle: tripFormData.selectedPackage ? `${tripFormData.selectedPackage}` : "Enter / Choose package name",
                    dialogTitle: "Add New Package",
                    errorMessage: "please select a package name"
                  }
                ),
                /* @__PURE__ */ jsx(
                  GeneralAccordion,
                  {
                    selectedItem: tripFormData.activity1,
                    onItemSelection: handleActivity1Selection,
                    required: true,
                    error: formErrors.activity1,
                    defaultContent: getAvailableActivitiesForActivity1(),
                    inputTitle: "Activity 1",
                    accordionTitle: tripFormData.activity1 ? `${tripFormData.activity1}` : "Enter / Choose Activity",
                    dialogTitle: "Add New Activity",
                    errorMessage: "please select an activity"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "tripsInputsFormCard", children: /* @__PURE__ */ jsx(
                  TripsExtraActivity,
                  {
                    selectedItems: tripFormData.selectedExtras || [],
                    onItemsSelection: handleExtrasSelection,
                    required: false,
                    error: showErrors && formErrors.selectedExtras,
                    defaultContent: [
                      { name: "Donkey Ride" },
                      { name: "Face Painting" },
                      { name: "Baking" }
                    ],
                    inputTitle: "Extra Activities",
                    accordionTitle: ((_a = tripFormData.selectedExtras) == null ? void 0 : _a.length) > 0 ? `${tripFormData.selectedExtras.length} item(s) selected` : "Select extra activities",
                    errorMessage: "Please select at least one extra activity"
                  }
                ) }),
                tripFormData.selectedPackage === "Package 4" && /* @__PURE__ */ jsx(
                  GeneralAccordion,
                  {
                    selectedItem: tripFormData.activity2,
                    onItemSelection: handleActivity2Selection,
                    required: true,
                    error: formErrors.activity2,
                    defaultContent: getAvailableActivitiesForActivity2(),
                    inputTitle: "Activity 2",
                    accordionTitle: tripFormData.activity2 ? `${tripFormData.activity2}` : "Enter / Choose Activity",
                    dialogTitle: "Add New Activity",
                    errorMessage: "please select an activity"
                  }
                ),
                /* @__PURE__ */ jsx(
                  GeneralAccordion,
                  {
                    selectedItem: tripFormData.companyLocation,
                    onItemSelection: handleCompanyLocationSelection,
                    required: true,
                    error: formErrors.companyLocation,
                    defaultContent: [
                      { name: "Location 1" },
                      { name: "Location 2" }
                    ],
                    inputTitle: "Company's Locations",
                    accordionTitle: tripFormData.companyLocation ? `${tripFormData.companyLocation}` : "Enter / Choose Location",
                    dialogTitle: "Add New Location",
                    errorMessage: "please select the location"
                  }
                ),
                /* @__PURE__ */ jsxs(
                  FormControl,
                  {
                    component: "fieldset",
                    error: formErrors.paymentStatus,
                    children: [
                      /* @__PURE__ */ jsxs(
                        RadioGroup,
                        {
                          row: true,
                          name: "paymentStatus",
                          value: tripFormData.paymentStatus || "",
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
                    ]
                  }
                ),
                tripFormData.paymentStatus === "paid" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    GeneralAccordion,
                    {
                      selectedItem: tripFormData.paymentType,
                      onItemSelection: handleTripPaymentTypeSelection,
                      required: true,
                      error: formErrors.paymentType,
                      defaultContent: [
                        { name: "Payment 1" },
                        { name: "Payment 2" }
                      ],
                      inputTitle: "Payment Type",
                      accordionTitle: "Enter / Choose Payment Type",
                      dialogTitle: "Add New Payment",
                      errorMessage: "please select the payment type"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                    /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Paid Amount" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        name: "paidAmount",
                        className: "tripsInputsFormCardInp",
                        value: tripFormData.paidAmount || "",
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
                        className: `tripsInputsPaymentImageContainer ${formErrors.paymentImage ? "error-input" : ""}`,
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
                          tripFormData.paymentImagePreview ? /* @__PURE__ */ jsx("div", { className: "paymentImagePreviewContainer", children: /* @__PURE__ */ jsxs("div", { className: "paymentImagePreviewImgContainer", children: [
                            /* @__PURE__ */ jsx(
                              "img",
                              {
                                src: tripFormData.paymentImagePreview,
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
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "tripsInputsFormCard", children: [
                  /* @__PURE__ */ jsx("p", { className: "tripsInputsFormCardLabel", children: "Notes" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      name: "notes",
                      className: "tripsInputsFormCardInp",
                      value: tripFormData.notes || "",
                      onChange: handleInputChange
                    }
                  )
                ] })
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
                backgroundColor: tripFormData.paymentStatus === "unpaid" ? "#FF181C" : "#44a047"
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
  ] }) });
}
function Trips() {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(TripsInputs, {}) });
}
export {
  Trips as default
};
