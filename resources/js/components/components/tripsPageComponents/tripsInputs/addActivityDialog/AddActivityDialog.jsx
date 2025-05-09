import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

const AddActivityDialog = ({ isOpen, onClose, onAddActivity }) => {
  const [newActivityName, setNewActivityName] = useState("");

  const handleAddActivity = () => {
    if (newActivityName.trim()) {
      onAddActivity(newActivityName.trim());
      setNewActivityName("");
    }
  };

  const handleClose = () => {
    onClose();
    setNewActivityName("");
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Add New Activity</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Activity Name"
          type="text"
          fullWidth
          variant="standard"
          value={newActivityName}
          onChange={(e) => setNewActivityName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddActivity}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddActivityDialog;
