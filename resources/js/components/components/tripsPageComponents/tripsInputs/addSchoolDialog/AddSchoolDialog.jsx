import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

const AddSchoolDialog = ({ isOpen, onClose, onAddSchool }) => {
  const [newSchoolName, setNewSchoolName] = useState("");

  const handleAddSchool = () => {
    if (newSchoolName.trim()) {
      onAddSchool(newSchoolName.trim());
      setNewSchoolName("");
    }
  };

  const handleClose = () => {
    onClose();
    setNewSchoolName("");
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Add New School</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="School Name"
          type="text"
          fullWidth
          variant="standard"
          value={newSchoolName}
          onChange={(e) => setNewSchoolName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddSchool}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSchoolDialog;
