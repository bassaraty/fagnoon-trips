import React, { useState } from "react";
import "./activity1Accordion.css";

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
import AddActivityDialog from "../addActivityDialog/AddActivityDialog";

const DEFAULT_ACTIVITIES = [
  { name: "Activity 1" },
  { name: "Activity 2" },
  { name: "Activity 3" },
];

const ActivityAccordion = ({
  selectedActivity,
  onActivitySelection,
  required = false,
  error = false,
}) => {
  const [activities, setActivities] = useState(DEFAULT_ACTIVITIES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenAddActivityDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddActivity = (newActivity) => {
    setActivities([...activities, { name: newActivity }]);
    setIsDialogOpen(false);
  };

  const activityJsx = activities.map((item, index) => (
    <FormControlLabel
      key={index}
      value={`${item.name}`}
      control={<Radio />}
      label={item.name}
    />
  ));

  return (
    <>
      <p className="tripsInputsFormCardLabel">Activity 1</p>
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
              value={selectedActivity}
              onChange={onActivitySelection}
              required={required}
            >
              {activityJsx}
            </RadioGroup>

            <div
              className="tripsInputsFormCardAccordionAddNewFieldContainer"
              onClick={handleOpenAddActivityDialog}
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
        {error && <FormHelperText>Please select a activity</FormHelperText>}
      </FormControl>

      <AddActivityDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onAddActivity={handleAddActivity}
      />
    </>
  );
};

export default ActivityAccordion;
