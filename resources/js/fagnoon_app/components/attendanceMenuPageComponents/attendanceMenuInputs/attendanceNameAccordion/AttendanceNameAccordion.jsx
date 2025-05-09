import { useEffect, useState } from "react";
import "./attendanceNameAccordion.css";

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

// Import event data context
import { useEventData } from "../../../../contexts/EventDataContext";

export default function AttendanceNameAccordion({
  selectedName,
  onNameSelection,
  required = false,
  error = false,
  birthdayId = null,
}) {
  // Get birthday events from the context
  const { events } = useEventData();
  const [birthdayEvents, setBirthdayEvents] = useState([]);
  const [selectedId, setSelectedId] = useState(birthdayId);
  const [expanded, setExpanded] = useState(false);

  // Filter only birthday events when component mounts or events changes
  useEffect(() => {
    if (events && events.length > 0) {
      // Get today's date in MM/DD/YYYY format
      const today = new Date();
      const todayFormatted = `${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;

      // Filter to only include birthday events with today's date
      const filteredBirthdays = events.filter(
        (event) =>
          event.birthdayName &&
          event.id &&
          event.birthdayDate === todayFormatted
      );

      setBirthdayEvents(filteredBirthdays);
    }
  }, [events]);

  // Set the initial selected ID if passed as prop or when birthdays load
  useEffect(() => {
    // When a specific ID is passed or found
    if (birthdayId) {
      setSelectedId(birthdayId);

      // If we have birthday events, find the name that matches this ID
      if (birthdayEvents.length > 0) {
        const foundEvent = birthdayEvents.find(
          (event) => event.id === birthdayId
        );
        if (foundEvent && !selectedName && onNameSelection) {
          // Create a synthetic event object with the value property
          const syntheticEvent = { target: { value: foundEvent.birthdayName } };
          onNameSelection(syntheticEvent);
        }
      }
    }
  }, [birthdayId, birthdayEvents, selectedName, onNameSelection]);

  // Update selected ID when name changes
  useEffect(() => {
    if (selectedName && birthdayEvents.length > 0) {
      const selectedEvent = birthdayEvents.find(
        (event) => event.birthdayName === selectedName
      );
      if (selectedEvent) {
        setSelectedId(selectedEvent.id);
      }
    }
  }, [selectedName, birthdayEvents]);

  // Handle name selection to include ID data
  const handleNameSelection = (event) => {
    const name = event.target.value;
    const selectedEvent = birthdayEvents.find(
      (event) => event.birthdayName === name
    );

    if (selectedEvent) {
      setSelectedId(selectedEvent.id);
    }

    // Pass name to parent component
    if (onNameSelection) {
      onNameSelection(event);
    }
  };

  // Toggle accordion expansion
  const handleAccordionChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const namesJsx = birthdayEvents.map((item, index) => (
    <FormControlLabel
      key={index}
      value={`${item.birthdayName}`}
      control={<Radio />}
      label={
        <span>
          {item.birthdayName} (Reservation ID:{" "}
          <Typography
            component="span"
            sx={{ color: "#ef585c", fontWeight: "bold" }}
          >
            {item.id}
          </Typography>
          )
        </span>
      }
    />
  ));

  return (
    <>
      <p className="tripsInputsFormCardLabel">Birthday Name</p>
      <FormControl error={error} fullWidth>
        <Accordion
          className="tripsInputsFormCardAccordion"
          expanded={expanded}
          onChange={handleAccordionChange}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography
              className="tripsInputsFormCardAccordionTitle"
              component="span"
            >
              {selectedName ? (
                <>
                  {selectedName}{" "}
                  {selectedId && (
                    <Typography
                      component="span"
                      sx={{ color: "#ef585c", fontWeight: "bold" }}
                    >
                      (ID: {selectedId})
                    </Typography>
                  )}
                </>
              ) : (
                "Choose a Name"
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="tripsInputsFormCardAccordionDetails">
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={selectedName || ""}
              onChange={handleNameSelection}
              required={required}
            >
              {namesJsx.length > 0 ? (
                namesJsx
              ) : (
                <Typography
                  sx={{ color: "text.secondary", fontStyle: "italic" }}
                >
                  No birthdays today
                </Typography>
              )}
            </RadioGroup>
          </AccordionDetails>
        </Accordion>
        {error && <FormHelperText>Please select a name</FormHelperText>}
      </FormControl>
    </>
  );
}
