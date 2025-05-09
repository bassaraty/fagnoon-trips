import React, { useState } from "react";
import "./birthdayExpectedAttendanceAccordion.css";

// MUI Imports
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FormHelperText } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";

// Components Imports
import BirthdayExpectedAttendanceDialog from "./birthdayExpectedAttendanceDialog/BirthdayExpectedAttendanceDialog";

const DEFAULT_EXPECTED_ATTENDANCE = [
  { name: "Attendance 1" },
  { name: "Attendance 2" },
  { name: "Attendance 3" },
];

const BirthdayExpectedAttendanceAccordion = ({
  selectedBirthdayExpectedAttendance,
  onBirthdayExpectedAttendanceSelection,
  required = false,
  error = false,
}) => {
  const [expectedAttendance, setExpectedAttendance] = useState(
    DEFAULT_EXPECTED_ATTENDANCE
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenAddBirthdayExpectedAttendanceDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddBirthdayExpectedAttendance = (newAttendance) => {
    setExpectedAttendance([...expectedAttendance, { name: newAttendance }]);
    setIsDialogOpen(false);
  };

  const birthdayExpectedAttendanceJsx = expectedAttendance.map(
    (item, index) => (
      <FormControlLabel
        key={index}
        value={`${item.name}`}
        control={<Radio />}
        label={item.name}
      />
    )
  );

  return (
    <>
      <p className="tripsInputsFormCardLabel">Expected Attendance</p>
      <FormControl error={error} fullWidth>
        <Accordion className="tripsInputsFormCardAccordion">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography
              className="tripsInputsFormCardAccordionTitle"
              component="span"
            >
              Choose item
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="tripsInputsFormCardAccordionDetails">
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={selectedBirthdayExpectedAttendance}
              onChange={onBirthdayExpectedAttendanceSelection}
              required={required}
            >
              {birthdayExpectedAttendanceJsx}
            </RadioGroup>

            <div
              className="tripsInputsFormCardAccordionAddNewFieldContainer"
              onClick={handleOpenAddBirthdayExpectedAttendanceDialog}
            >
              <div className="tripsInputsFormCardAccordionAddNewFieldIconContainer">
                +
              </div>
              <p className="tripsInputsFormCardAccordionAddNewFieldText">
                Add new one
              </p>
            </div>
          </AccordionDetails>
        </Accordion>
        {error && (
          <FormHelperText>Please select a expected attendance</FormHelperText>
        )}
      </FormControl>

      <BirthdayExpectedAttendanceDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onAddBirthdayExpectedAttendance={handleAddBirthdayExpectedAttendance}
      />
    </>
  );
};

export default BirthdayExpectedAttendanceAccordion;
