import React, { useState } from "react";
import "./tripsExtraActivity.css";

// MUI Imports
import { FormHelperText, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedItems, theme) {
  return {
    fontWeight: selectedItems.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const TripsExtraActivity = ({
  selectedItems = [],
  onItemsSelection,
  required = false,
  error = false,
  defaultContent,
  inputTitle,
  errorMessage,
}) => {
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const [initialState, setInitialState] = useState(defaultContent);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    // On autofill we get a stringified value
    const selectedValues = typeof value === "string" ? value.split(",") : value;
    onItemsSelection(selectedValues);
  };

  return (
    <>
      <p className="tripsInputsFormCardLabel">{inputTitle}</p>
      <FormControl error={error} fullWidth required={required}>
        <InputLabel id="multiple-chip-label">Select Activities</InputLabel>
        <Select
          labelId="multiple-chip-label"
          id="multiple-chip"
          multiple
          disabled
          value={selectedItems}
          onChange={handleChange}
          input={
            <OutlinedInput
              id="select-multiple-chip"
              label="Select Activities"
            />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {initialState.map((item, index) => (
            <MenuItem
              key={index}
              value={item.name}
              style={getStyles(item.name, selectedItems, theme)}
            >
              {item.name}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControl>
    </>
  );
};

export default TripsExtraActivity;
