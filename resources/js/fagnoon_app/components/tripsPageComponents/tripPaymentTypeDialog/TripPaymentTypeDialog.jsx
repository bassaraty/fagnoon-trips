import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

const TripPaymentTypeDialog = ({ isOpen, onClose, onAddTripPaymentType }) => {
  const [newTripPaymentTypeMethod, setNewPaymentTypeMethod] = useState("");

  const handleAddTripPaymentType = () => {
    if (newTripPaymentTypeMethod.trim()) {
      onAddTripPaymentType(newTripPaymentTypeMethod.trim());
      setNewPaymentTypeMethod("");
    }
  };

  const handleClose = () => {
    onClose();
    setNewPaymentTypeMethod("");
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Add New Payment Method</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="payment Name"
          type="text"
          fullWidth
          variant="standard"
          value={newTripPaymentTypeMethod}
          onChange={(e) => setNewPaymentTypeMethod(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddTripPaymentType}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TripPaymentTypeDialog;
