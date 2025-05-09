import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTripFormContext } from "../../../contexts/TripFormContext";
import "./tripsInputs.css";

// MUI Imports
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";

// Components Imports
import SidebarNav from "../../sidebarNav/SidebarNav";
import TripsInfo from "../tripsInfo/TripsInfo";
import GeneralAccordion from "./generalAccordion/GeneralAccordion";
import SchoolGradeInput from "./schoolGradeInput/SchoolGradeInput";
import SchoolNameAccordion from "./schoolNameAccordion/SchoolNameAccordion";
import TripChildrenAge from "./tripsChildrenAge/TripsChildrenAge";
import TripsExtraActivity from "./tripsExtraActivity/TripsExtraActivity";

// Activities options array
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
  "Mirror – Beads",
];

export default function TripsInputs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripFormData, updateTripFormData, resetTripFormData } =
    useTripFormContext();

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
    startTime: false,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showErrors, setShowErrors] = useState(false); // Add this to control when errors are shown

  // Accordion states - all expanded by default to prevent hidden required fields
  const [expanded, setExpanded] = useState({
    basicInfo: true,
    packageInfo: false,
    activities: false,
  });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // Simply toggle the accordion without validation
    setExpanded((prev) => ({
      ...prev,
      [panel]: isExpanded,
    }));
  };

  // Check if accordion sections have errors - only used after validation
  const hasBasicInfoErrors = () => {
    if (!showErrors) return false;
    return formErrors.selectedSchool || formErrors.date || formErrors.startTime;
  };

  const hasPackageInfoErrors = () => {
    if (!showErrors) return false;
    return (
      formErrors.selectedPackage ||
      formErrors.contactPerson ||
      formErrors.phoneNumber ||
      formErrors.numberOfGuests
    );
  };

  const hasActivitiesErrors = () => {
    if (!showErrors) return false;
    return (
      formErrors.activity1 ||
      (tripFormData.selectedPackage === "Package 4" && formErrors.activity2) ||
      formErrors.companyLocation ||
      formErrors.paymentStatus ||
      (tripFormData.paymentStatus === "paid" && formErrors.paymentType) ||
      (tripFormData.paymentStatus === "paid" && formErrors.paymentImage)
    );
  };

  useEffect(() => {
    if (location.state?.formData) {
      updateTripFormData(location.state.formData);
      setIsEditMode(true);
      setEditId(location.state.formData.editId);
    } else {
      resetTripFormData();
      setIsEditMode(false);
      setEditId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // Handle package selection and update activities accordingly
  const handlePackageSelection = (e) => {
    const selectedPackage = e.target.value;
    updateTripFormData({
      selectedPackage,
      // Reset activities when package changes
      activity1: "",
      activity2: "",
      // Set default extras based on package
      selectedExtras: getDefaultExtrasForPackage(selectedPackage),
    });
    if (showErrors) {
      setFormErrors((prev) => ({ ...prev, selectedPackage: false }));
    }
  };

  // Get default extras based on selected package
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

  // Get available activities for Activity 1 based on selected package
  const getAvailableActivitiesForActivity1 = () => {
    if (tripFormData.selectedPackage === "Package 1") {
      return [{ name: "Color Fight" }];
    }
    return ACTIVITIES_OPTIONS.map((activity) => ({ name: activity }));
  };

  // Get available activities for Activity 2 based on selected package
  const getAvailableActivitiesForActivity2 = () => {
    if (tripFormData.selectedPackage !== "Package 4") {
      return []; // Activity 2 should be hidden for packages other than 4
    }
    return ACTIVITIES_OPTIONS.map((activity) => ({ name: activity }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateTripFormData({ [name]: value });

    // Clear the error for this field only if we're showing errors
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          paymentImagePreview: reader.result,
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
      paymentImagePreview: null,
    });
  };

  // Custom form validation before submission
  const validateForm = () => {
    // Create new errors object
    const newErrors = {
      selectedSchool: !tripFormData.selectedSchool,
      selectedPackage: !tripFormData.selectedPackage,
      paidAmount: !tripFormData.paidAmount,
      activity1: !tripFormData.activity1,
      activity2:
        tripFormData.selectedPackage === "Package 4" && !tripFormData.activity2,
      companyLocation: !tripFormData.companyLocation,
      paymentStatus: !tripFormData.paymentStatus,
      paymentType:
        tripFormData.paymentStatus === "paid" && !tripFormData.paymentType,
      paymentImage:
        tripFormData.paymentStatus === "paid" && !tripFormData.paymentImage,
      contactPerson: !tripFormData.contactPerson,
      phoneNumber: !tripFormData.phoneNumber,
      numberOfGuests: !tripFormData.numberOfGuests,
      date: !tripFormData.date,
      startTime: !tripFormData.startTime,
    };

    setFormErrors(newErrors);
    setShowErrors(true); // Now show the errors

    // If there are errors, expand the relevant accordions
    if (newErrors.selectedSchool || newErrors.date || newErrors.startTime) {
      setExpanded((prev) => ({ ...prev, basicInfo: true }));
    }

    if (
      newErrors.selectedPackage ||
      newErrors.contactPerson ||
      newErrors.phoneNumber ||
      newErrors.numberOfGuests
    ) {
      setExpanded((prev) => ({ ...prev, packageInfo: true }));
    }

    if (
      newErrors.activity1 ||
      (tripFormData.selectedPackage === "Package 4" && newErrors.activity2) ||
      newErrors.companyLocation ||
      newErrors.paymentStatus ||
      (tripFormData.paymentStatus === "paid" && newErrors.paymentType) ||
      (tripFormData.paymentStatus === "paid" && newErrors.paymentImage)
    ) {
      setExpanded((prev) => ({ ...prev, activities: true }));
    }

    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate the form
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
        notes: tripFormData.notes,
      };

      // Append all data to formData
      Object.entries(tripData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append the image file if it exists
      if (tripFormData.paymentImage) {
        formData.append("paymentImage", tripFormData.paymentImage);
      }

      console.log("Form data to be submitted:", {
        ...tripData,
        paymentImage: tripFormData.paymentImage ? "File attached" : "No file",
      });

      console.log(isEditMode ? "Updating trip..." : "Creating new trip...");

      let response;
      if (isEditMode) {
        // PUT request for update
        // Note: When sending FormData with PUT, some backends expect a POST request with a _method field.
        // Laravel handles PUT with FormData directly.
        formData.append("_method", "PUT"); // Add this line if your backend needs it for FormData with PUT
        response = await fetch(`/api/trips/${tripFormData.editId}`, { // Use tripFormData.editId
          method: "POST", // Using POST with _method for FormData compatibility if needed, otherwise "PUT"
          body: formData,
          headers: {
            // "Content-Type": "multipart/form-data", // Don't set Content-Type, browser will do it for FormData
            "X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content"),
            "Accept": "application/json",
          },
        });
      } else {
        // POST request for create
        response = await fetch("/api/trips", {
          method: "POST",
          body: formData,
          headers: {
            // "Content-Type": "multipart/form-data", // Don't set Content-Type, browser will do it for FormData
            "X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content"),
            "Accept": "application/json",
          },
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save trip");
      }

      const result = await response.json();
      console.log("Trip saved successfully:", result);

      // Reset form and navigate
      resetTripFormData();
      setShowErrors(false); // Reset error display
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
    setShowErrors(false); // Reset error display
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
      startTime: false,
    });
  };

  return (
    <div className="tripsInputs">
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, md: 2.5 }}>
          <SidebarNav activePage="Trips" />
        </Grid>
        <Grid size={{ xs: 12, md: 9.5 }}>
          <TripsInfo />

          {submitError && (
            <div className="error-message">
              <Alert severity="error">{submitError}</Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="tripsInputsForm" noValidate>
            {/* Accordion 1: Basic Information */}
            <Accordion
              expanded={expanded.basicInfo}
              onChange={handleAccordionChange("basicInfo")}
              className={hasBasicInfoErrors() ? "accordion-with-error" : ""}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="tripBasicInfo-content"
                id="tripBasicInfo-header"
                className="outerAccordionSummary"
              >
                <Typography>
                  Company/School Information{" "}
                  {hasBasicInfoErrors() && (
                    <span className="error-indicator">*</span>
                  )}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="outerAccordionDetails">
                <SchoolNameAccordion
                  selectedSchool={tripFormData.selectedSchool}
                  onSchoolSelection={handleSchoolSelection}
                  required={true}
                  error={showErrors && formErrors.selectedSchool}
                />

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Date</p>
                  <input
                    type="date"
                    name="date"
                    className={`tripsInputsFormCardInp ${
                      showErrors && formErrors.date ? "error-input" : ""
                    }`}
                    value={tripFormData.date || ""}
                    onChange={handleInputChange}
                  />
                  {showErrors && formErrors.date && (
                    <FormHelperText error>Date is required</FormHelperText>
                  )}
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Start Time</p>
                  <input
                    type="time"
                    name="startTime"
                    className={`tripsInputsFormCardInp ${
                      showErrors && formErrors.startTime ? "error-input" : ""
                    }`}
                    value={tripFormData.startTime || ""}
                    onChange={handleInputChange}
                  />
                  {showErrors && formErrors.startTime && (
                    <FormHelperText error>
                      Start time is required
                    </FormHelperText>
                  )}
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Duration</p>
                  <input
                    type="text"
                    name="duration"
                    className="tripsInputsFormCardInp"
                    value={tripFormData.duration || ""}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">End Time</p>
                  <input
                    type="text"
                    name="endTime"
                    className="tripsInputsFormCardInp"
                    value={tripFormData.endTime || ""}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
              </AccordionDetails>
            </Accordion>

            {/* Accordion 2: Package Information */}
            <Accordion
              expanded={expanded.packageInfo}
              onChange={handleAccordionChange("packageInfo")}
              className={hasPackageInfoErrors() ? "accordion-with-error" : ""}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="tripPackageInfo-content"
                id="tripPackageInfo-header"
                className="outerAccordionSummary"
              >
                <Typography>
                  Contact Information
                  {hasPackageInfoErrors() && (
                    <span className="error-indicator">*</span>
                  )}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="outerAccordionDetails">
                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Contact Person</p>
                  <input
                    type="text"
                    name="contactPerson"
                    className={`tripsInputsFormCardInp ${
                      showErrors && formErrors.contactPerson
                        ? "error-input"
                        : ""
                    }`}
                    value={tripFormData.contactPerson || ""}
                    onChange={handleInputChange}
                  />
                  {showErrors && formErrors.contactPerson && (
                    <FormHelperText error>
                      Contact person is required
                    </FormHelperText>
                  )}
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Position</p>
                  <input
                    type="text"
                    name="position"
                    className="tripsInputsFormCardInp"
                    value={tripFormData.position || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Phone Number</p>
                  <input
                    type="number"
                    name="phoneNumber"
                    className={`tripsInputsFormCardInp ${
                      showErrors && formErrors.phoneNumber ? "error-input" : ""
                    }`}
                    value={tripFormData.phoneNumber || ""}
                    onChange={handleInputChange}
                  />
                  {showErrors && formErrors.phoneNumber && (
                    <FormHelperText error>
                      Phone number is required
                    </FormHelperText>
                  )}
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">School Grade</p>
                  <SchoolGradeInput
                    name="schoolGrade"
                    value={tripFormData.schoolGrade || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Children Age</p>
                  <TripChildrenAge
                    name="childrenAge"
                    value={tripFormData.childrenAge || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Number of Guests</p>
                  <input
                    type="text"
                    name="numberOfGuests"
                    className={`tripsInputsFormCardInp ${
                      showErrors && formErrors.numberOfGuests
                        ? "error-input"
                        : ""
                    }`}
                    value={tripFormData.numberOfGuests || ""}
                    onChange={handleInputChange}
                  />
                  {showErrors && formErrors.numberOfGuests && (
                    <FormHelperText error>
                      Number of guests is required
                    </FormHelperText>
                  )}
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">
                    Number of Supervisors
                  </p>
                  <input
                    type="text"
                    name="numberOfSupervisors"
                    className="tripsInputsFormCardInp"
                    value={tripFormData.numberOfSupervisors || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </AccordionDetails>
            </Accordion>

            {/* Accordion 3: Activities & Payments */}
            <Accordion
              expanded={expanded.activities}
              onChange={handleAccordionChange("activities")}
              className={hasActivitiesErrors() ? "accordion-with-error" : ""}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="activities-content"
                id="activities-header"
                className="outerAccordionSummary"
              >
                <Typography>
                  Packages & Activities & Payment
                  {hasActivitiesErrors() && (
                    <span className="error-indicator">*</span>
                  )}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="outerAccordionDetails">
                <GeneralAccordion
                  selectedItem={tripFormData.selectedPackage}
                  onItemSelection={handlePackageSelection}
                  required={true}
                  error={showErrors && formErrors.selectedPackage}
                  defaultContent={[
                    { name: "Package 1" },
                    { name: "Package 2" },
                    { name: "Package 3" },
                    { name: "Package 4" },
                  ]}
                  inputTitle={"Package"}
                  accordionTitle={
                    tripFormData.selectedPackage
                      ? `${tripFormData.selectedPackage}`
                      : "Enter / Choose package name"
                  }
                  dialogTitle={"Add New Package"}
                  errorMessage={"please select a package name"}
                />

                <GeneralAccordion
                  selectedItem={tripFormData.activity1}
                  onItemSelection={handleActivity1Selection}
                  required={true}
                  error={formErrors.activity1}
                  defaultContent={getAvailableActivitiesForActivity1()}
                  inputTitle={"Activity 1"}
                  accordionTitle={
                    tripFormData.activity1
                      ? `${tripFormData.activity1}`
                      : "Enter / Choose Activity"
                  }
                  dialogTitle={"Add New Activity"}
                  errorMessage={"please select an activity"}
                />

                <div className="tripsInputsFormCard">
                  <TripsExtraActivity
                    selectedItems={tripFormData.selectedExtras || []}
                    onItemsSelection={handleExtrasSelection}
                    required={false}
                    error={showErrors && formErrors.selectedExtras}
                    defaultContent={[
                      { name: "Donkey Ride" },
                      { name: "Face Painting" },
                      { name: "Baking" },
                    ]}
                    inputTitle={"Extra Activities"}
                    accordionTitle={
                      tripFormData.selectedExtras?.length > 0
                        ? `${tripFormData.selectedExtras.length} item(s) selected`
                        : "Select extra activities"
                    }
                    errorMessage={"Please select at least one extra activity"}
                  />
                </div>

                {tripFormData.selectedPackage === "Package 4" && (
                  <GeneralAccordion
                    selectedItem={tripFormData.activity2}
                    onItemSelection={handleActivity2Selection}
                    required={true}
                    error={formErrors.activity2}
                    defaultContent={getAvailableActivitiesForActivity2()}
                    inputTitle={"Activity 2"}
                    accordionTitle={
                      tripFormData.activity2
                        ? `${tripFormData.activity2}`
                        : "Enter / Choose Activity"
                    }
                    dialogTitle={"Add New Activity"}
                    errorMessage={"please select an activity"}
                  />
                )}

                <GeneralAccordion
                  selectedItem={tripFormData.companyLocation}
                  onItemSelection={handleCompanyLocationSelection}
                  required={true}
                  error={formErrors.companyLocation}
                  defaultContent={[
                    { name: "Location 1" },
                    { name: "Location 2" },
                  ]}
                  inputTitle={"Company's Locations"}
                  accordionTitle={
                    tripFormData.companyLocation
                      ? `${tripFormData.companyLocation}`
                      : "Enter / Choose Location"
                  }
                  dialogTitle={"Add New Location"}
                  errorMessage={"please select the location"}
                />

                <FormControl
                  component="fieldset"
                  error={formErrors.paymentStatus}
                >
                  <RadioGroup
                    row
                    name="paymentStatus"
                    value={tripFormData.paymentStatus || ""}
                    onChange={handlePaymentStatusChange}
                    className="tripsInputsFormCardPayment"
                  >
                    <FormControlLabel
                      value="paid"
                      control={<Radio />}
                      label="Paid"
                    />
                    <FormControlLabel
                      value="unpaid"
                      control={<Radio />}
                      label="Unpaid"
                    />
                  </RadioGroup>
                  {formErrors.paymentStatus && (
                    <FormHelperText error>
                      Please select a payment status
                    </FormHelperText>
                  )}
                </FormControl>

                {tripFormData.paymentStatus === "paid" && (
                  <>
                    <GeneralAccordion
                      selectedItem={tripFormData.paymentType}
                      onItemSelection={handleTripPaymentTypeSelection}
                      required={true}
                      error={formErrors.paymentType}
                      defaultContent={[
                        { name: "Payment 1" },
                        { name: "Payment 2" },
                      ]}
                      inputTitle={"Payment Type"}
                      accordionTitle={"Enter / Choose Payment Type"}
                      dialogTitle={"Add New Payment"}
                      errorMessage={"please select the payment type"}
                    />

                    <div className="tripsInputsFormCard">
                      <p className="tripsInputsFormCardLabel">Paid Amount</p>
                      <input
                        type="text"
                        name="paidAmount"
                        className="tripsInputsFormCardInp"
                        value={tripFormData.paidAmount || ""}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.paidAmount && (
                        <p className="error-message">
                          Please enter the paid amount
                        </p>
                      )}
                    </div>

                    <div className="tripsInputsFormCard">
                      <p className="tripsInputsFormCardLabel">Payment Image</p>
                      <div
                        className={`tripsInputsPaymentImageContainer ${
                          formErrors.paymentImage ? "error-input" : ""
                        }`}
                        onClick={handlePaymentImageClick}
                      >
                        <input
                          id="paymentImageUpload"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handlePaymentImageChange}
                        />
                        {tripFormData.paymentImagePreview ? (
                          <div className="paymentImagePreviewContainer">
                            <div className="paymentImagePreviewImgContainer">
                              <img
                                src={tripFormData.paymentImagePreview}
                                alt="Payment Preview"
                                className="paymentImagePreview"
                              />
                              <button
                                onClick={handleDeletePaymentImage}
                                className="deletePaymentImageButton"
                              >
                                <CloseIcon className="deletePaymentImageButtonIcon" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="tripsInputsPaymentImageDragContainer">
                            <div className="tripsInputsPaymentImageDragImgWrapper">
                              <img
                                src="/assets/tripAssets/aboutUsBrowse.svg"
                                alt=""
                                className="tripsInputsPaymentImageDragImg"
                              />
                            </div>
                            <p className="tripsInputsPaymentImageDragText">
                              Drag & Drop here
                            </p>
                            or
                            <p className="tripsInputsPaymentImageBrowseText">
                              Browse Files to upload
                            </p>
                          </div>
                        )}
                      </div>
                      {formErrors.paymentImage && (
                        <FormHelperText error>
                          Please upload the payment image
                        </FormHelperText>
                      )}
                    </div>
                  </>
                )}

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Notes</p>
                  <input
                    type="text"
                    name="notes"
                    className="tripsInputsFormCardInp"
                    value={tripFormData.notes || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </AccordionDetails>
            </Accordion>

            <div className="tripsInputsFormSubmitAndCancel">
              <div className="tripsInputsFormSubmitBtnContainer">
                <Button
                  type="submit"
                  variant="contained"
                  className="tripsInputsFormSubmitBtn"
                  style={{
                    backgroundColor:
                      tripFormData.paymentStatus === "unpaid"
                        ? "#FF181C"
                        : "#44a047",
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Processing..."
                    : isEditMode
                    ? "Update"
                    : "Save"}
                </Button>
              </div>
              <div className="tripsInputsFormCancelContainer">
                <Button
                  type="button"
                  variant="outlined"
                  className="tripsInputsFormCancel"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Grid>
      </Grid>
    </div>
  );
}
