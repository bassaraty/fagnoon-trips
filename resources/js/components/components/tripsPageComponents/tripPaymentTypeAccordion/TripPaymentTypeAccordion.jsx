import React, { useState } from "react";
import "./tripPaymentTypeAccordion.css";

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
import TripPaymentTypeDialog from "../tripPaymentTypeDialog/TripPaymentTypeDialog";

const DEFAULT_PAYMENT_METHOD = [
  { name: "Payment 1" },
  { name: "Payment 2" },
  { name: "Payment 3" },
];

const TripPaymentTypeAccordion = ({
  selectedTripPaymentType,
  onTripPaymentTypeSelection,
  required = false,
  error = false,
}) => {
  const [tripPayments, setTripPayments] = useState(DEFAULT_PAYMENT_METHOD);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenAddTripPaymentTypeDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddCompanyTripPaymentType = (newTripPayment) => {
    setTripPayments([...tripPayments, { name: newTripPayment }]);
    setIsDialogOpen(false);
  };

  const tripPaymentTypeJsx = tripPayments.map((item, index) => (
    <FormControlLabel
      key={index}
      value={`${item.name}`}
      control={<Radio />}
      label={item.name}
    />
  ));

  return (
    <>
      <p className="tripsInputsFormCardLabel">Payment Type</p>
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
              value={selectedTripPaymentType}
              onChange={onTripPaymentTypeSelection}
              required={required}
            >
              {tripPaymentTypeJsx}
            </RadioGroup>

            <div
              className="tripsInputsFormCardAccordionAddNewFieldContainer"
              onClick={handleOpenAddTripPaymentTypeDialog}
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
          <FormHelperText>Please select a payment method</FormHelperText>
        )}
      </FormControl>

      <TripPaymentTypeDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onAddTripPaymentType={handleAddCompanyTripPaymentType}
      />
    </>
  );
};

export default TripPaymentTypeAccordion;
