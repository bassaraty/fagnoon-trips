import React, { useState } from "react";
import "./packageAccordion.css";

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
import AddPackageDialog from "./addPackageDialog/AddPackageDialog";

const DEFAULT_PACKAGES = [
  { name: "Package 1" },
  { name: "Package 2" },
  { name: "Package 3" },
];

const PackageAccordion = ({
  selectedPackage,
  onPackageSelection,
  required = false,
  error = false,
}) => {
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenAddPackageDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddPackage = (newPackage) => {
    setPackages([...packages, { name: newPackage }]);
    setIsDialogOpen(false);
  };

  const packagesJsx = packages.map((item, index) => (
    <FormControlLabel
      key={index}
      value={`${item.name}`}
      control={<Radio />}
      label={item.name}
    />
  ));

  return (
    <>
      <p className="tripsInputsFormCardLabel">Package</p>
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
              {selectedPackage
                ? `${selectedPackage}`
                : "Enter / Choose package name"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="tripsInputsFormCardAccordionDetails">
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={selectedPackage}
              onChange={onPackageSelection}
              required={required}
            >
              {packagesJsx}
            </RadioGroup>

            <div
              className="tripsInputsFormCardAccordionAddNewFieldContainer"
              onClick={handleOpenAddPackageDialog}
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
        {error && <FormHelperText>Please select a package</FormHelperText>}
      </FormControl>

      <AddPackageDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onAddPackage={handleAddPackage}
      />
    </>
  );
};

export default PackageAccordion;
