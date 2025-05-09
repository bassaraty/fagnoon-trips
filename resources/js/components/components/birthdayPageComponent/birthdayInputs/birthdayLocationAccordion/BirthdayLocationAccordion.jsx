import React, { useState } from "react";
import "./birthdayLocationAccordion.css";

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
import BirthdayLocationDialog from "./birthdayLocationDialog/BirthdayLocationDialog";

const DEFAULT_Locations = [
  { name: "Location 1" },
  { name: "Location 2" },
  { name: "Location 3" },
];

const BirthdayLocationAccordion = ({
  selectedBirthdayLocation,
  onBirthdayLocationSelection,
  required = false,
  error = false,
}) => {
  const [locations, setLocations] = useState(DEFAULT_Locations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenAddBirthdayLocationDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddBirthdayLocation = (newLocation) => {
    setLocations([...locations, { name: newLocation }]);
    setIsDialogOpen(false);
  };

  const birthdayLocationJsx = locations.map((item, index) => (
    <FormControlLabel
      key={index}
      value={`${item.name}`}
      control={<Radio />}
      label={item.name}
    />
  ));

  return (
    <>
      <p className="tripsInputsFormCardLabel">Location</p>
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
              {selectedBirthdayLocation
                ? `${selectedBirthdayLocation}`
                : "Choose location"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="tripsInputsFormCardAccordionDetails">
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={selectedBirthdayLocation}
              onChange={onBirthdayLocationSelection}
              required={required}
            >
              {birthdayLocationJsx}
            </RadioGroup>

            <div
              className="tripsInputsFormCardAccordionAddNewFieldContainer"
              onClick={handleOpenAddBirthdayLocationDialog}
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
        {error && <FormHelperText>Please select a location</FormHelperText>}
      </FormControl>

      <BirthdayLocationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onAddBirthdayLocation={handleAddBirthdayLocation}
      />
    </>
  );
};

export default BirthdayLocationAccordion;
