import React, { useEffect, useState } from "react";
import "./generalAccordion.css";

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
import GeneralInputDialog from "./generalInputDialog/GeneralInputDialog";

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
}) => {
  const [localContent, setLocalContent] = useState(defaultContent || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Add this useEffect to update localContent when defaultContent changes
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

  // Debug logs to check what's happening
  // console.log(`${inputTitle} options:`, localContent);

  const contentJsx = localContent.map((item, index) => (
    <FormControlLabel
      key={index}
      value={`${item.name}`}
      control={<Radio />}
      label={item.name}
    />
  ));

  return (
    <>
      <p className="tripsInputsFormCardLabel">{inputTitle}</p>
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
              {accordionTitle}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="tripsInputsFormCardAccordionDetails">
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={selectedItem}
              onChange={onItemSelection}
              required={required}
            >
              {contentJsx}
            </RadioGroup>

            <div
              className="tripsInputsFormCardAccordionAddNewFieldContainer"
              onClick={handleOpenAddItemDialog}
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
        {error && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControl>

      <GeneralInputDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onAddFunction={handleAddItem}
        dialogTitle={dialogTitle}
      />
    </>
  );
};

export default GeneralAccordion;
