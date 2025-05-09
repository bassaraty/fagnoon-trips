import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./birthdayInputs.css";

// MUI Imports
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
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

// Components Imports
import SidebarNav from "../../sidebarNav/SidebarNav";
import BirthdayInfo from "../birthdayInfo/BirthdayInfo";
import BirthdayKidsCount from "../birthdayKidsCount/BirthdayKidsCount";
import GeneralAccordion from "./generalAccordion/GeneralAccordion";
import LocationAccordion from "./locationAccordion/LocationAccordion";
import useBirthdayInputs from "./useBirthdayInputs";
import useBirthdayLocations from "./useBirthdayLocations";

export default function BirthdayInputs() {
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
    handleSnackbarClose,
  } = useBirthdayInputs();

  // Use the location hook directly in the component
  const {
    availableBranches,
    availableLocations,
    // eslint-disable-next-line no-unused-vars
    reservedLocations,
    handleBirthdayBranchSelection,
    handleBirthdayLocationSelection,
  } = useBirthdayLocations();

  // This effect is kept here because it's related to the component's mounting
  useEffect(() => {
    if (location.state?.formData) {
      // This is handled in the hook now
    } else {
      // This is handled in the hook now
    }
  }, [location.state]);

  // Validate duration input on change
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

  return (
    <div className="birthdayInputs">
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, md: 2.5 }}>
          <SidebarNav activePage="Birthdays" />
        </Grid>
        <Grid size={{ xs: 12, md: 9.5 }}>
          <BirthdayInfo />

          {submitError && (
            <div className="error-message">
              <Alert severity="error">{submitError}</Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="tripsInputsForm" noValidate>
            {/* Accordion 1: Birthday Name to End Time */}
            <Accordion
              expanded={expanded.basicInfo}
              onChange={handleAccordionChange("basicInfo")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="basicInfo-content"
                id="basicInfo-header"
                className="outerAccordionSummary"
              >
                <Typography>Basic Information</Typography>
              </AccordionSummary>
              <AccordionDetails className="outerAccordionDetails">
                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Birthday Name</p>
                  <input
                    type="text"
                    name="birthdayName"
                    placeholder="Enter birthday name"
                    className={`tripsInputsFormCardInp`}
                    value={birthdayFormData.birthdayName || ""}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.birthdayName && (
                    <p className="error-message">
                      Please enter a birthday name
                    </p>
                  )}
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Client Name</p>
                  <input
                    type="text"
                    name="clientName"
                    placeholder="Enter client name"
                    className="tripsInputsFormCardInp"
                    value={birthdayFormData.clientName || ""}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.clientName && (
                    <p className="error-message">Please enter a client name</p>
                  )}
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Client Number</p>
                  <input
                    type="number"
                    name="clientNumber"
                    placeholder="Enter client number"
                    className="tripsInputsFormCardInp"
                    value={birthdayFormData.clientNumber || ""}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.clientNumber && (
                    <p className="error-message">
                      Please enter a client number
                    </p>
                  )}
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Birthday Date</p>
                  <input
                    type="date"
                    name="birthdayDate"
                    placeholder="Enter date of birthday"
                    className="tripsInputsFormCardInp"
                    value={birthdayFormData.birthdayDate || ""}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.birthdayDate && (
                    <p className="error-message">
                      Please enter a birthday date
                    </p>
                  )}
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Start Time</p>
                  <input
                    type="time"
                    name="startTime"
                    placeholder="HH:MM (e.g., 14:30)"
                    className="tripsInputsFormCardInp"
                    value={birthdayFormData.startTime || ""}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.startTime && (
                    <p className="error-message">Please enter the start time</p>
                  )}
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Duration</p>
                  <input
                    type="text"
                    name="duration"
                    placeholder="4 hours"
                    className="tripsInputsFormCardInp"
                    value={birthdayFormData.duration || "4 hours"}
                    onChange={handleInputChange}
                    required
                    disabled
                  />
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">End Time</p>
                  <input
                    type="text"
                    name="endTime"
                    placeholder="After 4 hours of the start time"
                    className="tripsInputsFormCardInp"
                    value={birthdayFormData.endTime || ""}
                    onChange={handleInputChange}
                    required
                    readOnly
                    disabled
                  />
                </div>
              </AccordionDetails>
            </Accordion>

            {/* Accordion 2: Birthday Kid/s Count to */}
            <Accordion
              expanded={expanded.kidsInfo}
              onChange={handleAccordionChange("kidsInfo")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="kidsInfo-content"
                id="kidsInfo-header"
                className="outerAccordionSummary"
              >
                <Typography>Kids Information</Typography>
              </AccordionSummary>
              <AccordionDetails className="outerAccordionDetails">
                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">
                    Birthday Kid/s Count
                  </p>
                  <BirthdayKidsCount
                    name="birthdayKidsCount"
                    value={birthdayFormData.birthdayKidsCount || ""}
                    onChange={handleInputChange}
                    placeholder="Enter kids count"
                    required
                  />
                  {formErrors.birthdayKidsCount && (
                    <p className="error-message">Please enter the kids count</p>
                  )}
                </div>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Kid/s Name</p>
                  <input
                    type="text"
                    name="kidName"
                    placeholder="Enter kid/s Name"
                    className="tripsInputsFormCardInp"
                    value={birthdayFormData.kidName || ""}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.kidName && (
                    <p className="error-message">Please enter the kid name</p>
                  )}
                </div>

                <FormControl>
                  <FormLabel className="tripsInputsFormCardLabel">
                    Kid's gender
                  </FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={birthdayFormData.gender || ""}
                    onChange={handleGenderChange}
                    className="tripsInputsFormCardPayment"
                  >
                    <FormControlLabel
                      value="boy"
                      control={<Radio />}
                      label="Boy"
                    />
                    <FormControlLabel
                      value="girl"
                      control={<Radio />}
                      label="Girl"
                    />
                  </RadioGroup>
                  {formErrors.gender && (
                    <FormHelperText error>
                      Please select a gender
                    </FormHelperText>
                  )}
                </FormControl>

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Kid's birthday</p>
                  <input
                    type="date"
                    name="kidBirthday"
                    placeholder="Enter date of kid's birthday"
                    className="tripsInputsFormCardInp"
                    value={birthdayFormData.kidBirthday || ""}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.kidBirthday && (
                    <p className="error-message">
                      Please enter the kid birthday
                    </p>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>

            {/* Accordion 3: Decoration Theme to Additional Extras */}
            <Accordion
              expanded={expanded.decorationExtras}
              onChange={handleAccordionChange("decorationExtras")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="decorationExtras-content"
                id="decorationExtras-header"
                className="outerAccordionSummary"
              >
                <Typography>Decoration & Extras</Typography>
              </AccordionSummary>
              <AccordionDetails className="outerAccordionDetails">
                <GeneralAccordion
                  selectedItem={birthdayFormData.decorationTheme}
                  onItemSelection={handleBirthdayDecorationThemeSelection}
                  required={false}
                  error={formErrors.decorationTheme}
                  defaultContent={[{ name: "Theme 1" }, { name: "Theme 2" }]}
                  inputTitle={"Decoration theme"}
                  accordionTitle={
                    birthdayFormData.decorationTheme
                      ? `${birthdayFormData.decorationTheme}`
                      : "Choose a theme"
                  }
                  dialogTitle={"Add New Theme"}
                  errorMessage={"please select a decoration theme"}
                />

                <GeneralAccordion
                  selectedItem={birthdayFormData.ballonColor}
                  onItemSelection={handleBirthdayBallonColorSelection}
                  required={false}
                  error={formErrors.ballonColor}
                  defaultContent={[
                    { name: "red" },
                    { name: "green" },
                    { name: "blue" },
                  ]}
                  inputTitle={"Ballon Color"}
                  accordionTitle={
                    birthdayFormData.ballonColor
                      ? `${birthdayFormData.ballonColor}`
                      : "Choose a color"
                  }
                  dialogTitle={"Add New Color"}
                  errorMessage={"please select a ballon color"}
                />

                <GeneralAccordion
                  selectedItem={birthdayFormData.artActivities}
                  onItemSelection={handleBirthdayArtActivitiesSelection}
                  required={false}
                  error={formErrors.artActivities}
                  defaultContent={[
                    { name: "Activity 1" },
                    { name: "Activity 2" },
                  ]}
                  inputTitle={"Art Activities"}
                  accordionTitle={
                    birthdayFormData.artActivities
                      ? `${birthdayFormData.artActivities}`
                      : "Choose an activity"
                  }
                  dialogTitle={"Add New Activity"}
                  errorMessage={"please select the art activity"}
                />

                <GeneralAccordion
                  selectedItem={birthdayFormData.additionalExtras}
                  onItemSelection={handleBirthdayAdditionalExtrasSelection}
                  required={false}
                  error={formErrors.additionalExtras}
                  defaultContent={[{ name: "Extra 1" }, { name: "Extra 2" }]}
                  inputTitle={"Additional Extras"}
                  accordionTitle={
                    birthdayFormData.additionalExtras
                      ? `${birthdayFormData.additionalExtras}`
                      : "Choose an additional extras"
                  }
                  dialogTitle={"Add New Additional Extras"}
                  errorMessage={"please select the additional extras"}
                />
              </AccordionDetails>
            </Accordion>

            {/* Accordion 4: F&B In House to Feedback */}
            <Accordion
              expanded={expanded.foodBeverage}
              onChange={handleAccordionChange("foodBeverage")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="foodBeverage-content"
                id="foodBeverage-header"
                className="outerAccordionSummary"
              >
                <Typography>Food & Beverage</Typography>
              </AccordionSummary>
              <AccordionDetails className="outerAccordionDetails">
                <GeneralAccordion
                  selectedItem={birthdayFormData.FBOutsourcing}
                  onItemSelection={handleBirthdayFBOutsourcingSelection}
                  required={false}
                  error={formErrors.FBOutsourcing}
                  defaultContent={[{ name: "Option 1" }, { name: "Option 2" }]}
                  inputTitle={"F&B (Out Sourced)"}
                  accordionTitle={
                    birthdayFormData.FBOutsourcing
                      ? `${birthdayFormData.FBOutsourcing}`
                      : "Choose F&B (Out Sourced)"
                  }
                  dialogTitle={"Add New Option"}
                  errorMessage={"please select the F&B (Out Sourced)"}
                />

                <GeneralAccordion
                  selectedItem={birthdayFormData.FBInHouse}
                  onItemSelection={handleBirthdayFBInHouseSelection}
                  required={false}
                  error={formErrors.FBInHouse}
                  defaultContent={[{ name: "Option 1" }, { name: "Option 2" }]}
                  inputTitle={"F&B in House"}
                  accordionTitle={
                    birthdayFormData.FBInHouse
                      ? `${birthdayFormData.FBInHouse}`
                      : "Choose F&B in House"
                  }
                  dialogTitle={"Add New Option"}
                  errorMessage={"please select the F&B (In House)"}
                />

                <FormControl>
                  <RadioGroup
                    row
                    name="paymentStatus"
                    value={birthdayFormData.paymentStatus || ""}
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

                {birthdayFormData.paymentStatus === "paid" && (
                  <>
                    <div className="tripsInputsFormCard">
                      <p className="tripsInputsFormCardLabel">Paid Amount</p>
                      <input
                        type="text"
                        name="paidAmount"
                        placeholder="Enter the paid amount"
                        className="tripsInputsFormCardInp"
                        value={birthdayFormData.paidAmount || ""}
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
                        className="tripsInputsPaymentImageContainer"
                        onClick={handlePaymentImageClick}
                      >
                        <input
                          id="paymentImageUpload"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handlePaymentImageChange}
                        />
                        {birthdayFormData.paymentImagePreview ? (
                          <div className="paymentImagePreviewContainer">
                            <div className="paymentImagePreviewImgContainer">
                              <img
                                src={birthdayFormData.paymentImagePreview}
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

                    <div className="tripsInputsFormCard">
                      <p className="tripsInputsFormCardLabel">
                        Remarks of Payment
                      </p>
                      <input
                        type="text"
                        name="remarksOfPayment"
                        placeholder="type here..."
                        className="tripsInputsFormCardInp"
                        value={birthdayFormData.remarksOfPayment || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                <div className="tripsInputsFormCard">
                  <p className="tripsInputsFormCardLabel">Feedback</p>
                  <div
                    className="tripsInputsPaymentImageContainer"
                    onClick={handleFeedbackImageClick}
                  >
                    <input
                      id="feedbackImageUpload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFeedbackImageChange}
                    />
                    {birthdayFormData.feedbackImagePreview ? (
                      <div className="paymentImagePreviewContainer">
                        <div className="paymentImagePreviewImgContainer">
                          <img
                            src={birthdayFormData.feedbackImagePreview}
                            alt="Feedback Preview"
                            className="paymentImagePreview"
                          />
                          <button
                            onClick={handleDeleteFeedbackImage}
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
                          Add Feedback Image
                        </p>
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
                </div>
              </AccordionDetails>
            </Accordion>

            {/* Accordion 5: Party Leader to Duration of Action and Packages */}
            <Accordion
              expanded={expanded.eventDetails}
              onChange={handleAccordionChange("eventDetails")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel5a-content"
                id="panel5a-header"
                className="outerAccordionSummary"
              >
                <Typography>Event Details</Typography>
              </AccordionSummary>
              <AccordionDetails className="outerAccordionDetails">
                <GeneralAccordion
                  selectedItem={birthdayFormData.birthdayBranch}
                  onItemSelection={handleBirthdayBranchSelection}
                  required={true}
                  error={formErrors.birthdayBranch}
                  defaultContent={availableBranches}
                  inputTitle={"Branch"}
                  accordionTitle={
                    birthdayFormData.birthdayBranch
                      ? `${birthdayFormData.birthdayBranch}`
                      : "Choose a branch"
                  }
                  dialogTitle={"Add New Branch"}
                  errorMessage={"please select the branch"}
                  showDialog={false}
                />

                <LocationAccordion
                  selectedItem={birthdayFormData.birthdayLocation}
                  onItemSelection={handleBirthdayLocationSelection}
                  required={true}
                  error={formErrors.birthdayLocation}
                  defaultContent={availableLocations}
                  inputTitle={"Locations"}
                  accordionTitle={
                    birthdayFormData.birthdayLocation
                      ? Array.isArray(birthdayFormData.birthdayLocation)
                        ? birthdayFormData.birthdayLocation.join(", ") ||
                          "Choose locations"
                        : `${birthdayFormData.birthdayLocation}` ||
                          "Choose a location"
                      : "Choose a location"
                  }
                  // dialogTitle={"Add New Location"}
                  errorMessage={"please select the location"}
                  branch={birthdayFormData.birthdayBranch} // Pass branch to LocationAccordion
                />

                <GeneralAccordion
                  selectedItem={birthdayFormData.birthdayPackage}
                  onItemSelection={handleBirthdayPackageSelection}
                  required={true}
                  error={formErrors.birthdayPackage}
                  defaultContent={[
                    { name: " Basic" },
                    { name: " Deluxe" },
                    { name: " Premium" },
                    { name: " Weekdays" },
                  ]}
                  inputTitle={"Package"}
                  accordionTitle={
                    birthdayFormData.birthdayPackage
                      ? `${birthdayFormData.birthdayPackage}`
                      : "Choose a Package"
                  }
                  dialogTitle={"Add New Package"}
                  errorMessage={"please select the package"}
                />

                <GeneralAccordion
                  selectedItem={birthdayFormData.birthdayExpectedAttendance}
                  onItemSelection={handleBirthdayExpectedAttendanceSelection}
                  required={false}
                  error={formErrors.birthdayExpectedAttendance}
                  defaultContent={[
                    { name: "Attendance 1" },
                    { name: "Attendance 2" },
                  ]}
                  inputTitle={"Expected Attendance"}
                  accordionTitle={
                    birthdayFormData.birthdayExpectedAttendance
                      ? `${birthdayFormData.birthdayExpectedAttendance}`
                      : "Choose a attendance"
                  }
                  dialogTitle={"Add New Attendance"}
                  errorMessage={"please select the expected attendance"}
                />

                <GeneralAccordion
                  selectedItem={birthdayFormData.partyLeader}
                  onItemSelection={handleBirthdayPartyLeaderSelection}
                  required={false}
                  error={formErrors.partyLeader}
                  defaultContent={[{ name: "Leader 1" }, { name: "Leader 2" }]}
                  inputTitle={"Party leader"}
                  accordionTitle={
                    birthdayFormData.partyLeader
                      ? `${birthdayFormData.partyLeader}`
                      : "Choose the party leader"
                  }
                  dialogTitle={"Add New Leader"}
                  errorMessage={"please select the party leader"}
                />

                {birthdayFormData.actions.map((action, index) => (
                  <div
                    key={action.id}
                    className="birthdaysFormActionsAndAddAction"
                  >
                    {index > 0 && (
                      <div className="birthdaysFormActionsAndAddActionBtnContainer">
                        <DeleteIcon
                          className="birthdaysFormActionsAndAddActionBtn"
                          onClick={() => removeAction(action.id)}
                          style={{ color: "red", cursor: "pointer" }}
                        />
                      </div>
                    )}
                    <GeneralAccordion
                      selectedItem={action.value}
                      onItemSelection={(e) =>
                        updateAction(action.id, { value: e.target.value })
                      }
                      required={false}
                      error={formErrors[`action${index + 1}`]}
                      defaultContent={[
                        { name: "Action 1" },
                        { name: "Action 2" },
                      ]}
                      inputTitle={`Action ${index + 1}`}
                      accordionTitle={
                        action.value ? `${action.value}` : "Choose an Action"
                      }
                      dialogTitle={"Add New Action"}
                      errorMessage={"please select this action"}
                    />

                    {/* Start Time of Action */}
                    <div className="tripsInputsFormCard">
                      <p className="tripsInputsFormCardLabel">
                        Start Time of Action {index + 1}
                      </p>
                      <input
                        type="time"
                        name={`startTime_${action.id}`}
                        placeholder="HH:MM (e.g., 17:50)"
                        className="tripsInputsFormCardInp"
                        value={action.startTime || ""}
                        onChange={(e) =>
                          handleActionTimeChange(
                            action.id,
                            "startTime",
                            e.target.value
                          )
                        }
                      />
                      {formErrors[`startTime_${action.id}`] && (
                        <p className="error-message">
                          Please enter start time for this action
                        </p>
                      )}
                    </div>

                    {/* Duration of Action */}
                    <div className="tripsInputsFormCard">
                      <p className="tripsInputsFormCardLabel">
                        Duration of Action {index + 1}
                      </p>
                      <input
                        type="text"
                        name={`duration_${action.id}`}
                        placeholder="HH:MM (e.g., 1:45)"
                        pattern="\d+:[0-5]\d"
                        title="Enter duration in HH:MM format (e.g., 1:45)"
                        className="tripsInputsFormCardInp"
                        value={action.duration || ""}
                        onInput={(e) => handleDurationInput(e, action.id)}
                      />
                      {formErrors[`duration_${action.id}`] && (
                        <p className="error-message">
                          Please enter duration in HH:MM format (e.g., 1:45)
                        </p>
                      )}
                    </div>

                    {/* End Time of Action (Calculated) */}
                    <div className="tripsInputsFormCard">
                      <p className="tripsInputsFormCardLabel">
                        End Time of Action {index + 1}
                      </p>
                      <input
                        type="text"
                        name={`endTime_${action.id}`}
                        placeholder="Auto-calculated"
                        className="tripsInputsFormCardInp"
                        value={action.endTime || ""}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                ))}

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addNewAction}
                  style={{ marginTop: "15px" }}
                >
                  Add Action
                </Button>
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
                      birthdayFormData.paymentStatus === "unpaid"
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
      {localSnackbar.map((snack, index) => (
        <Snackbar
          key={snack.id}
          open={snack.open}
          autoHideDuration={6000}
          onClose={() => handleSnackbarClose(snack.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          sx={{ bottom: `${24 + index * 60}px` }}
        >
          <Alert
            severity="error"
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => handleSnackbarClose(snack.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{ width: "100%" }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
}
