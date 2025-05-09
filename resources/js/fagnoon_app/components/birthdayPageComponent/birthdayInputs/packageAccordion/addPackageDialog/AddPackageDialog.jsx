import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

const AddPackageDialog = ({ isOpen, onClose, onAddPackage }) => {
  const [newPackageName, setNewPackageName] = useState("");

  const handleAddPackage = () => {
    if (newPackageName.trim()) {
      onAddPackage(newPackageName.trim());
      setNewPackageName("");
    }
  };

  const handleClose = () => {
    onClose();
    setNewPackageName("");
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Add New Package</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Package Name"
          type="text"
          fullWidth
          variant="standard"
          value={newPackageName}
          onChange={(e) => setNewPackageName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddPackage}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPackageDialog;
