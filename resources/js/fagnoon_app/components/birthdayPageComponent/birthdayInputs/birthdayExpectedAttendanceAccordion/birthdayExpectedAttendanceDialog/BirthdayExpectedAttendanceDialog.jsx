import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

const BirthdayExpectedAttendanceDialog = ({
  isOpen,
  onClose,
  onAddBirthdayExpectedAttendance,
}) => {
  const [newBirthdayExpectedAttendance, setNewBirthdayExpectedAttendance] =
    useState("");

  const handleAddBirthdayExpectedAttendance = () => {
    if (newBirthdayExpectedAttendance.trim()) {
      onAddBirthdayExpectedAttendance(newBirthdayExpectedAttendance.trim());
      setNewBirthdayExpectedAttendance("");
    }
  };

  const handleClose = () => {
    onClose();
    setNewBirthdayExpectedAttendance("");
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Add New Attendance</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="expected attendance Name"
          type="text"
          fullWidth
          variant="standard"
          value={newBirthdayExpectedAttendance}
          onChange={(e) => setNewBirthdayExpectedAttendance(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddBirthdayExpectedAttendance}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BirthdayExpectedAttendanceDialog;
