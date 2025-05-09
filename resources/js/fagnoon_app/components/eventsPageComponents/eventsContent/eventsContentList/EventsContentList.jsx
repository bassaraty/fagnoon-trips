import { useState } from "react";
import "./eventsContentList.css";

// MUI Imports
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

// Context and component imports
import { useEventData } from "../../../../contexts/EventDataContext";
import EventsContentDeleteDialog from "../eventsContentDeleteDialog/EventsContentDeleteDialog";

export default function EventsContentList({ events, eventType }) {
  // Get the delete function from context
  const { deleteEvent } = useEventData();

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // State for feedback messages
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate displayed rows based on pagination
  const displayedEvents = events.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Delete functionality
  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!eventToDelete) return;

    try {
      // Call the context function to update state
      deleteEvent(eventToDelete.id);

      // Show success message
      setSnackbar({
        open: true,
        message: "Event deleted successfully",
        severity: "success",
      });

      // When you move to a real backend, you would add code here to make the API call
    } catch (error) {
      console.error("Error deleting event:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete event",
        severity: "error",
      });
    } finally {
      handleCloseDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Function to handle phone calls
  const handlePhoneCall = (phoneNumber) => {
    // Remove any non-digit characters from the phone number
    const cleanedNumber = phoneNumber.replace(/\D/g, "");

    // Create the tel: link and open it
    window.location.href = `tel:${cleanedNumber}`;
  };

  return (
    <div className="eventsContentList">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="simple table">
          <TableHead className="eventsContentListTableHead">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Birthday Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Package</TableCell>
              <TableCell>Birthday Date </TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="eventsContentListTableBody">
            {displayedEvents.map((event) => {
              // Determine the phone number based on event type
              const phoneNumber =
                eventType === "birthdays"
                  ? event.birthdayClientNumber
                  : event.tripClientNumber;

              return (
                <TableRow
                  key={event.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    {eventType === "birthdays" ? event.id : event.id}
                  </TableCell>
                  <TableCell>
                    {eventType === "birthdays"
                      ? event.birthdayName
                      : event.tripName}
                  </TableCell>
                  <TableCell>
                    {eventType === "birthdays"
                      ? event.birthdayLocation
                      : event.tripLocation}
                  </TableCell>
                  <TableCell>
                    {eventType === "birthdays"
                      ? event.birthdayPackage
                      : event.tripPackage}
                  </TableCell>
                  <TableCell>
                    {eventType === "birthdays"
                      ? event.birthdayDate
                      : event.tripDate}
                  </TableCell>
                  <TableCell>
                    {eventType === "birthdays"
                      ? event.clientName
                      : event.schoolName}
                  </TableCell>
                  <TableCell>
                    {eventType === "birthdays"
                      ? event.birthdayStartTime
                      : event.tripStartTime}
                  </TableCell>
                  <TableCell>
                    {eventType === "birthdays"
                      ? event.birthdayDuration
                      : event.tripDuration}
                  </TableCell>
                  <TableCell>
                    {eventType === "birthdays"
                      ? event.birthdayEndTime
                      : event.tripEndTime}
                  </TableCell>
                  <TableCell>
                    <div className="eventsContentListTableBodyActionImgContainer">
                      {/* <img
                      src="/assets/eventsAssets/message.svg"
                      alt=""
                      className="eventsContentListTableBodyActionImg"
                    /> */}
                      <img
                        src="/assets/eventsAssets/red-trash.svg"
                        alt="Delete"
                        title="Delete event"
                        className="eventsContentListTableBodyActionImg"
                        onClick={() => handleDeleteClick(event)}
                      />
                      <img
                        src="/assets/eventsAssets/callMe.svg"
                        alt="Call"
                        title={`Call ${phoneNumber}`}
                        className="eventsContentListTableBodyActionImg"
                        onClick={() => handlePhoneCall(phoneNumber)}
                      />
                      <img
                        src="/assets/eventsAssets/add.svg"
                        alt=""
                        className="eventsContentListTableBodyActionImg"
                        style={
                          eventType === "birthdays"
                            ? { display: "block" }
                            : { display: "none" }
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={events.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="eventsContentListPagination"
          labelRowsPerPage="Rows per page"
          SelectProps={{
            inputProps: {
              name: "rows-per-page",
              id: "rows-per-page-select",
            },
          }}
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <EventsContentDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        eventToDelete={eventToDelete}
        eventType={eventType}
      />

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
