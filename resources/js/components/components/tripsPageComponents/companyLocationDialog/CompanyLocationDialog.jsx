import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

const CompanyLocationDialog = ({ isOpen, onClose, onAddCompanyLocation }) => {
  const [newCompanyLocationName, setNewCompanyLocationName] = useState("");

  const handleAddCompanyLocation = () => {
    if (newCompanyLocationName.trim()) {
      onAddCompanyLocation(newCompanyLocationName.trim());
      setNewCompanyLocationName("");
    }
  };

  const handleClose = () => {
    onClose();
    setNewCompanyLocationName("");
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
          value={newCompanyLocationName}
          onChange={(e) => setNewCompanyLocationName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddCompanyLocation}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyLocationDialog;
