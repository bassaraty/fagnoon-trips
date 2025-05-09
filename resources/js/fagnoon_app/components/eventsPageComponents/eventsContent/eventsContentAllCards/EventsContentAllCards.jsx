import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./eventsContentAllCards.css";

// MUI Imports
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";

// Context and component imports
import { useAttendanceMenuContext } from "../../../../contexts/AttendanceMenuContext";
import { useEventData } from "../../../../contexts/EventDataContext";
import EventsContentDeleteDialog from "../eventsContentDeleteDialog/EventsContentDeleteDialog";

export default function EventsContentAllCards({ events, eventType }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { deleteEvent } = useEventData();
  const { updateAttendanceMenuData } = useAttendanceMenuContext();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Check if today's date matches the birthday date
  const isToday = (dateString) => {
    if (!dateString) return false;

    const today = new Date();
    const todayFormatted = `${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;

    return dateString === todayFormatted;
  };

  // Force component re-render when location changes
  useEffect(() => {
    // This will trigger re-render when the location changes
  }, [location]);

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const handleConfirmDelete = async () => {
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

      // API call to delete the event
      const endpoint =
        eventType === "birthdays"
          ? `/api/birthdays/${eventToDelete.id}`
          : `/api/trips/${eventToDelete.id}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Add any necessary headers like CSRF token if not handled globally
          "X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content"),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete event");
      }
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

  const handlePhoneCall = (phoneNumber) => {
    const cleanedNumber = phoneNumber.replace(/\D/g, "");
    window.location.href = `tel:${cleanedNumber}`;
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const [month, day, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const formatTimeForInput = (timeString) => {
    if (!timeString) return "";
    const [time, period] = timeString.split(" ");
    if (!time || !period) return "";
    let [hours, minutes] = time.split(":");

    if (period === "PM" && hours !== "12") {
      hours = String(parseInt(hours, 10) + 12);
    } else if (period === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours.padStart(2, "0")}:${minutes}`;
  };

  const handleEditClick = (event) => {
    if (eventType === "trips") {
      const formData = {
        selectedSchool: event.schoolName,
        date: formatDateForInput(event.tripDate),
        startTime: formatTimeForInput(event.tripStartTime),
        duration: event.tripDuration,
        endTime: event.tripEndTime,
        selectedPackage: event.tripPackage,
        contactPerson: event.contactPerson,
        position: event.position,
        phoneNumber: event.tripClientNumber,
        schoolGrade: event.schoolGrade,
        childrenAge: event.childrenAge,
        numberOfGuests: event.numberOfGuests,
        numberOfSupervisors: event.numberOfSupervisors,
        activity1: event.activity1,
        activity2: event.activity2,
        companyLocation: event.tripLocation,
        paymentStatus: event.tripPaymentStatus,
        paymentType: event.paymentType,
        paidAmount: event.paidAmount,
        notes: event.notes,
        isEditing: true,
        editId: event.id,
      };
      navigate("/trips", { state: { formData }, replace: true });
    } else if (eventType === "birthdays") {
      const formData = {
        birthdayName: event.birthdayName,
        clientName: event.clientName,
        clientNumber: event.birthdayClientNumber,
        birthdayDate: formatDateForInput(event.birthdayDate),
        startTime: formatTimeForInput(event.birthdayStartTime),
        duration: event.birthdayDuration,
        endTime: event.birthdayEndTime,
        birthdayKidsCount: event.birthdayKidsCount,
        kidName: event.kidName,
        gender: event.gender,
        kidBirthday: formatDateForInput(event.kidBirthday),
        birthdayLocation: event.birthdayLocation,
        birthdayPackage: event.birthdayPackage,
        birthdayExpectedAttendance: event.birthdayExpectedAttendance,
        decorationTheme: event.decorationTheme,
        ballonColor: event.ballonColor,
        birthdayAdultAndKidsNum: event.birthdayAdultAndKidsNum,
        detailsForEach: event.detailsForEach,
        artActivities: event.artActivities,
        additionalExtras: event.additionalExtras,
        FBOutsourcing: event.FBOutsourcing,
        FBInHouse: event.FBInHouse,
        paymentStatus: event.birthdayPaymentStatus,
        paidAmount: event.paidAmount,
        remarksOfPayment: event.remarksOfPayment,
        paymentImagePreview: event.paymentImageUrl || "",
        feedbackImagePreview: event.feedbackImageUrl || "",
        partyLeader: event.partyLeader,
        startTimeOfEvent: formatTimeForInput(event.startTimeOfEvent),
        action1: event.action1,
        durationAction1: event.durationAction1,
        action2: event.action2,
        durationAction2: event.durationAction2,
        action3: event.action3,
        durationAction3: event.durationAction3,
        isEditing: true,
        editId: event.id,
      };
      navigate("/birthdays", { state: { formData }, replace: true });
    }
  };

  // Function to handle attendance button click
  const handleAttendanceClick = (event) => {
    // Set birthday name and ID in the attendance menu context
    updateAttendanceMenuData({
      birthdayName: event.birthdayName,
      birthdayId: event.id,
    });

    // Navigate to attendance menu with replace: true to avoid the navigation issue
    navigate("/attendance-menu", { replace: true });
  };

  return (
    <div className="eventsContentAllCards">
      <Grid container spacing={3}>
        {events.map((event) => {
          const phoneNumber =
            eventType === "birthdays"
              ? event.birthdayClientNumber
              : event.tripClientNumber;

          // Check if the birthday is today
          const isBirthdayToday =
            eventType === "birthdays" && isToday(event.birthdayDate);

          return (
            <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
              <div className="eventsContentCard">
                <div className="eventsContentCardTitleAndIcons">
                  <p className="eventsContentCardTitle">
                    {eventType === "birthdays"
                      ? event.birthdayName
                      : event.tripName}
                  </p>
                  <div className="eventsContentCardIcons">
                    <img
                      src="/assets/eventCardsAssets/edit.svg"
                      alt="Edit"
                      className="eventsContentCardIcon"
                      onClick={() => handleEditClick(event)}
                    />
                    <img
                      src="/assets/eventCardsAssets/trash.svg"
                      alt="Delete"
                      className="eventsContentCardIcon"
                      onClick={() => handleDeleteClick(event)}
                    />
                    <img
                      src="/assets/eventCardsAssets/call.svg"
                      alt="Call"
                      title={`Call ${phoneNumber}`}
                      className="eventsContentCardIcon"
                      onClick={() => handlePhoneCall(phoneNumber)}
                    />
                    {eventType === "birthdays" && (
                      <img
                        src="/assets/eventCardsAssets/add-circle.svg"
                        alt="Add Attendance"
                        title={
                          isBirthdayToday
                            ? "Add Attendance"
                            : "Attendance only available on birthday date"
                        }
                        className="eventsContentCardIcon"
                        style={{
                          display: "block",
                          opacity: isBirthdayToday ? 1 : 0.3,
                          cursor: isBirthdayToday ? "pointer" : "not-allowed",
                        }}
                        onClick={
                          isBirthdayToday
                            ? () => handleAttendanceClick(event)
                            : undefined
                        }
                      />
                    )}
                  </div>
                </div>
                <p className="eventsContentCardDate">
                  {eventType === "birthdays"
                    ? event.birthdayDate
                    : event.tripDate}
                </p>
                <p className="eventsContentCardNumber">
                  {eventType === "birthdays"
                    ? event.birthdayLocation
                    : event.tripLocation}
                </p>
                <p className="eventsContentCardPackage">
                  {eventType === "birthdays"
                    ? event.birthdayPackage
                    : event.tripPackage}
                </p>
                <div className="eventsContentCardPaidStatus">
                  <div
                    className={`eventsContentCardPaidStatusColor ${
                      (eventType === "birthdays"
                        ? event.birthdayPaymentStatus
                        : event.tripPaymentStatus) === "paid"
                        ? "paid"
                        : (eventType === "birthdays"
                            ? event.birthdayPaymentStatus
                            : event.tripPaymentStatus) === "unpaid"
                        ? "unpaid"
                        : "partial"
                    }`}
                  ></div>
                  <p className="eventsContentCardPaidStatusText">
                    {(eventType === "birthdays"
                      ? event.birthdayPaymentStatus
                      : event.tripPaymentStatus
                    )
                      .charAt(0)
                      .toUpperCase() +
                      (eventType === "birthdays"
                        ? event.birthdayPaymentStatus
                        : event.tripPaymentStatus
                      ).slice(1)}
                  </p>
                </div>
              </div>
            </Grid>
          );
        })}
      </Grid>

      <EventsContentDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        eventToDelete={eventToDelete}
        eventType={eventType}
      />

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
