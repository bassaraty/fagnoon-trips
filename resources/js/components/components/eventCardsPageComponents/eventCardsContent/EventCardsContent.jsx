import { useState } from "react";
import "./eventCardsContent.css";

// MUI Imports
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";

// Components Imports
import { useEventData } from "../../../contexts/EventDataContext";
import SidebarNav from "../../sidebarNav/SidebarNav";
import EventCardsInfo from "../eventCardsInfo/EventCardsInfo";

export default function EventCardsContent() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    events,
    loading,
    error,
    eventType,
    changeEventType,
    LoadingComponent,
  } = useEventData();

  const handleDisplayContentChange = (event) => {
    const newType = event.target.value;
    changeEventType(newType);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEvents = events.filter((event) => {
    if (eventType === "birthdays") {
      return (
        event.birthdayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.birthdayClientNumber?.includes(searchTerm)
      );
    } else {
      // For trips
      return (
        event.tripName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tripClientNumber?.includes(searchTerm)
      );
    }
  });

  if (loading) {
    return (
      <div className="eventCardsContent">
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 2.5 }}>
            <SidebarNav activePage="Event Cards" />
          </Grid>
          <Grid size={{ xs: 12, md: 9.5 }}>
            <LoadingComponent />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (error) {
    return (
      <div className="eventCardsContent">
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 2.5 }}>
            <SidebarNav activePage="Event Cards" />
          </Grid>
          <Grid size={{ xs: 12, md: 9.5 }}>
            <p>Error: {error}</p>
          </Grid>
        </Grid>
      </div>
    );
  }

  return (
    <div className="eventCardsContent">
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, md: 2.5 }}>
          <SidebarNav activePage="Event Cards" />
        </Grid>
        <Grid size={{ xs: 12, md: 9.5 }}>
          {/* start event cards info */}
          <EventCardsInfo
            breadCrumbsLinkName={
              eventType === "birthdays" ? "Birthdays" : "Trips"
            }
            breadCrumbsLinkPath={
              eventType === "birthdays" ? "/birthdays" : "/trips"
            }
          />
          {/* end event cards info */}

          {/* card content filter and search start */}
          <div className="eventCardsContentDisplayType">
            <div className="eventCardsContentDisplayTypeIconContainer">
              <img
                src="/assets/eventCardsAssets/displayTypeIcon.svg"
                alt=""
                className="eventCardsContentDisplayTypeIcon"
              />
            </div>

            <FormControl>
              <Select
                id="demo-simple-select"
                name="displayContent"
                value={eventType}
                onChange={handleDisplayContentChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                className="eventCardsContentDisplayTypeList"
              >
                <MenuItem value={"birthdays"}>Birthdays</MenuItem>
                <MenuItem value={"trips"}>Trips</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="eventCardsContentSearchAndFilter">
            <div className="eventCardsContentSearchWrapper">
              <Paper
                component="form"
                className="eventCardsContentSearchContainer"
              >
                <SearchIcon sx={{ p: 1, color: "#8c8c8c" }} />
                <InputBase
                  className="eventCardsContentSearch"
                  name="eventCardsContentSearch"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  inputProps={{ "aria-label": "search events" }}
                />
              </Paper>
            </div>
            <div className="eventCardsContentFilterImgContainer">
              <img
                src="/assets/eventCardsAssets/filterIcon.svg"
                alt=""
                className="eventCardsContentSearchAndFilterImg"
              />
            </div>
          </div>
          {/* card content filter and search end */}

          {/* fetched cards here start */}
          <div className="eventCardsContentAllCards">
            <Grid container spacing={3}>
              {filteredEvents.map((event) => (
                <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                  <div className="eventCardsContentCard">
                    <div className="eventCardsContentCardTitleAndIcons">
                      <p className="eventCardsContentCardTitle">
                        {eventType === "birthdays"
                          ? event.birthdayName
                          : event.tripName}
                      </p>
                      <div className="eventCardsContentCardIcons">
                        <img
                          src="/assets/eventCardsAssets/edit.svg"
                          alt=""
                          className="eventCardsContentCardIcon"
                        />
                        <img
                          src="/assets/eventCardsAssets/trash.svg"
                          alt=""
                          className="eventCardsContentCardIcon"
                        />
                        <img
                          src="/assets/eventCardsAssets/call.svg"
                          alt=""
                          className="eventCardsContentCardIcon"
                        />
                        <img
                          src="/assets/eventCardsAssets/add-circle.svg"
                          alt=""
                          className="eventCardsContentCardIcon"
                        />
                      </div>
                    </div>
                    <p className="eventCardsContentCardDate">
                      {eventType === "birthdays"
                        ? event.birthdayDate
                        : event.tripDate}
                    </p>
                    <p className="eventCardsContentCardNumber">
                      {eventType === "birthdays"
                        ? event.birthdayClientNumber
                        : event.tripClientNumber}
                    </p>
                    <p className="eventCardsContentCardPackage">
                      {eventType === "birthdays"
                        ? event.birthdayPackage
                        : event.tripPackage}
                    </p>
                    <div className="eventCardsContentCardPaidStatus">
                      <div
                        className={`eventCardsContentCardPaidStatusColor ${
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
                      <p className="eventCardsContentCardPaidStatusText">
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
              ))}
            </Grid>
          </div>
          {/* fetched cards here end */}
        </Grid>
      </Grid>
    </div>
  );
}
