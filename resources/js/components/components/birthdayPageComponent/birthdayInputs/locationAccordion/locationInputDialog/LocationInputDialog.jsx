import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";

const GeneralInputDialog = ({
  isOpen,
  onClose,
  onAddFunction,
  dialogTitle,
}) => {
  const [newStateName, setNewStateName] = useState("");

  const handleAddItem = () => {
    if (newStateName.trim()) {
      onAddFunction(newStateName.trim());
      setNewStateName("");
    }
  };

  const handleClose = () => {
    onClose();
    setNewStateName("");
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={`${dialogTitle}`}
          type="text"
          fullWidth
          variant="standard"
          value={newStateName}
          onChange={(e) => setNewStateName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddItem}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GeneralInputDialog;
