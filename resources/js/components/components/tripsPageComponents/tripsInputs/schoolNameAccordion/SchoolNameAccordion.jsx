import React, { useMemo, useState } from "react";
import "./schoolNameAccordion.css";

// MUI Imports
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { FormHelperText, InputAdornment, TextField } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";

// Components Imports
import AddSchoolDialog from "../addSchoolDialog/AddSchoolDialog";

const DEFAULT_SCHOOL_NAMES = [
  { name: "School 1" },
  { name: "School 2" },
  { name: "School 3" },
];

const SchoolNameAccordion = ({
  selectedSchool,
  onSchoolSelection,
  required = false,
  error = false,
  // eslint-disable-next-line no-unused-vars
  onAddSchool,
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

  // Filter schools based on search term
  const filteredSchools = useMemo(() => {
    return schoolNames.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [schoolNames, searchTerm]);

  const schoolNamesJsx = filteredSchools.map((item, index) => (
    <FormControlLabel
      key={index}
      value={`${item.name}`}
      control={<Radio />}
      label={item.name}
    />
  ));

  return (
    <>
      <p className="tripsInputsFormCardLabel">Company/School Name</p>
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
              {selectedSchool
                ? `${selectedSchool}`
                : "Enter / Choose school name"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="tripsInputsFormCardAccordionDetails">
            {/* Search input */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search schools"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: "white",
                  marginBottom: "10px",
                },
              }}
            />

            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={selectedSchool}
              onChange={onSchoolSelection}
              required={required}
            >
              {schoolNamesJsx}
            </RadioGroup>

            {filteredSchools.length === 0 && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ textAlign: "center", mt: 2 }}
              >
                No schools found
              </Typography>
            )}

            <div
              className="tripsInputsFormCardAccordionAddNewFieldContainer"
              onClick={handleOpenAddSchoolDialog}
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
          <FormHelperText>Please select a school/company</FormHelperText>
        )}
      </FormControl>

      <AddSchoolDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onAddSchool={handleAddSchoolName}
      />
    </>
  );
};

export default SchoolNameAccordion;
