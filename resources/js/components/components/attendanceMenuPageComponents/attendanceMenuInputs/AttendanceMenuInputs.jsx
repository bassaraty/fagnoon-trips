import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./attendanceMenuInputs.css";

// MUI Imports
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";

// Contexts Imports
import { useAttendanceMenuContext } from "../../../contexts/AttendanceMenuContext";

// Components Imports
import SidebarNav from "../../sidebarNav/SidebarNav";
import AttendanceMenuInfo from "../attendanceMenuInfo/AttendanceMenuInfo";
import AdultsCountInput from "./adultsCountInput/AdultsCountInput";
import AttendanceNameAccordion from "./attendanceNameAccordion/AttendanceNameAccordion";
import KidsCountInput from "./kidsCountInput/KidsCountInput";

export default function AttendanceMenuInputs() {
  const navigate = useNavigate();

  // Use the attendance menu context
  const {
    attendanceMenuData,
    updateAttendanceMenuData,
    updateAdultData,
    updateKidData,
    resetAttendanceMenuData,
  } = useAttendanceMenuContext();

  // State to track form validation errors
  const [formErrors, setFormErrors] = useState({
    birthdayName: false,
  });

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateAttendanceMenuData({ [name]: value });
  };

  // Function to handle adult input changes
  const handleAdultInputChange = (index, field) => (e) => {
    updateAdultData(index, field, e.target.value);
  };

  // Function to handle kid input changes
  const handleKidInputChange = (index, field) => (e) => {
    updateKidData(index, field, e.target.value);
  };

  // Function to handle birthday name selection
  const handleBirthdayNameSelection = (e) => {
    const selectedBirthdayName = e.target.value;
    updateAttendanceMenuData({ birthdayName: selectedBirthdayName });
    // Clear birthdayName selection error when a name is selected
    setFormErrors((prev) => ({ ...prev, birthdayName: false }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const errors = {
      birthdayName: !attendanceMenuData.birthdayName,
    };

    // Check if there are any errors
    const hasErrors = Object.values(errors).some((error) => error);

    if (hasErrors) {
      // Set errors and prevent form submission
      setFormErrors(errors);
      return;
    }

    // Log or send the form data
    console.log("Form Submitted:", attendanceMenuData);

    // Here you would typically send the data to a backend or perform further actions

    // Navigate back to events after successful submission
    navigate("/events", { replace: true });
  };

  // Function to handle form cancellation
  const handleCancel = () => {
    // Reset form using context method
    resetAttendanceMenuData();
    // Reset form errors
    setFormErrors({
      birthdayName: false,
    });

    // Navigate back to events
    navigate("/events", { replace: true });
  };

  // Render adult input fields based on adultsCount
  const renderAdultInputs = () => {
    const { adults } = attendanceMenuData;

    return adults.map((adult, index) => (
      <div key={`adult-${index}`}>
        <div className="tripsInputsFormCard">
          <p className="tripsInputsFormCardLabel">Adult {index + 1} Name</p>
          <input
            type="text"
            placeholder={`Please enter adult ${index + 1} name`}
            className="tripsInputsFormCardInp"
            value={adult.name}
            onChange={handleAdultInputChange(index, "name")}
            required
          />
        </div>

        <div className="tripsInputsFormCard">
          <p className="tripsInputsFormCardLabel">Adult {index + 1} Number</p>
          <input
            type="number"
            placeholder={`Enter adult ${index + 1} phone number`}
            className="tripsInputsFormCardInp"
            value={adult.number}
            onChange={handleAdultInputChange(index, "number")}
            required
          />
        </div>
      </div>
    ));
  };

  // Render kid input fields based on kidsCount
  const renderKidInputs = () => {
    const { kids } = attendanceMenuData;

    return kids.map((kid, index) => (
      <div key={`kid-${index}`} className="tripsInputsFormCard">
        <p className="tripsInputsFormCardLabel">Kid {index + 1} Name</p>
        <input
          type="text"
          placeholder={`Please enter kid ${index + 1} name`}
          className="tripsInputsFormCardInp"
          value={kid.name}
          onChange={handleKidInputChange(index, "name")}
          required
        />
      </div>
    ));
  };

  return (
    <div className="attendanceMenuInputs">
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, md: 2.5 }}>
          <SidebarNav activePage="Attendance Menu" />
        </Grid>
        <Grid size={{ xs: 12, md: 9.5 }}>
          {/* start attendance menu info */}
          <AttendanceMenuInfo />
          {/* end attendance menu info */}

          {/* start inputs form */}
          <form onSubmit={handleSubmit} className="tripsInputsForm">
            {/* <GeneralAccordion
              selectedItem={attendanceMenuData.birthdayName}
              onItemSelection={handleBirthdayNameSelection}
              required={true}
              error={formErrors.birthdayName}
              defaultContent={[{ name: "Name 1" }, { name: "Name 2" }]}
              inputTitle={"Birthday Name"}
              accordionTitle={"Choose a Name"}
              dialogTitle={"Add New Name"}
              errorMessage={"please select this birthday name"}
            /> */}

            <AttendanceNameAccordion
              selectedName={attendanceMenuData.birthdayName}
              onNameSelection={handleBirthdayNameSelection}
              required={true}
              error={formErrors.birthdayName}
              birthdayId={attendanceMenuData.birthdayId}
            />

            <div className="tripsInputsFormCard">
              <p className="tripsInputsFormCardLabel">Guest Name</p>
              <input
                type="text"
                name="guestName"
                placeholder="please enter the guest name"
                className="tripsInputsFormCardInp"
                value={attendanceMenuData.guestName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="tripsInputsFormCard">
              <p className="tripsInputsFormCardLabel">Adults Count</p>
              <AdultsCountInput
                name="adultsCount"
                value={attendanceMenuData.adultsCount}
                onChange={handleInputChange}
                placeholder="Enter adults count"
                required
              />
            </div>

            {/* Render dynamic adult input fields start */}
            {renderAdultInputs()}
            {/* Render dynamic adult input fields end */}

            <div className="tripsInputsFormCard">
              <p className="tripsInputsFormCardLabel">Kids Count</p>
              <KidsCountInput
                name="kidsCount"
                value={attendanceMenuData.kidsCount}
                onChange={handleInputChange}
                placeholder="Enter kids count"
                required
              />
            </div>

            {/* Render dynamic kid input fields start */}
            {renderKidInputs()}
            {/* Render dynamic kid input fields end */}

            <div className="tripsInputsFormCard">
              <p className="tripsInputsFormCardLabel">Remarks</p>
              <input
                type="text"
                name="remarks"
                placeholder="please enter the remarks"
                className="tripsInputsFormCardInp"
                value={attendanceMenuData.remarks}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* attendance menu inputs submit button start */}
            <div className="tripsInputsFormSubmitAndCancel">
              <div className="tripsInputsFormSubmitBtnContainer">
                <Button
                  type="submit"
                  variant="contained"
                  className="tripsInputsFormSubmitBtn"
                  style={{ backgroundColor: "#44a047" }}
                >
                  Save
                </Button>
              </div>
              <div className="tripsInputsFormCancelContainer">
                <Button
                  type="button"
                  variant="outlined"
                  className="tripsInputsFormCancel"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
            {/* attendance menu inputs submit button end */}
          </form>
          {/* end inputs form */}
        </Grid>
      </Grid>
    </div>
  );
}
