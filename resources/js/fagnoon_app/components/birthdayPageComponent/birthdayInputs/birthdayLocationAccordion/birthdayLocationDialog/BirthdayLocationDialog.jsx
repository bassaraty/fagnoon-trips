import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

const BirthdayLocationDialog = ({ isOpen, onClose, onAddBirthdayLocation }) => {
  const [newBirthdayLocationName, setNewBirthdayLocationName] = useState("");

  const handleAddBirthdayLocation = () => {
    if (newBirthdayLocationName.trim()) {
      onAddBirthdayLocation(newBirthdayLocationName.trim());
      setNewBirthdayLocationName("");
    }
  };

  const handleClose = () => {
    onClose();
    setNewBirthdayLocationName("");
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Add New Location</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="location Name"
          type="text"
          fullWidth
          variant="standard"
          value={newBirthdayLocationName}
          onChange={(e) => setNewBirthdayLocationName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddBirthdayLocation}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BirthdayLocationDialog;
