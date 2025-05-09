import { useState } from "react";
import "./eventsContent.css";

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
import EventInfo from "../eventInfo/EventInfo";
import EventsContentAllCards from "./eventsContentAllCards/EventsContentAllCards";
import EventsContentCalendar from "./eventsContentCalendar/EventsContentCalendar";
import EventsContentList from "./eventsContentList/EventsContentList";

export default function EventsContent() {
  const [searchTerm, setSearchTerm] = useState("");

  // Add state to track view mode (cards or list)
  const [viewMode, setViewMode] = useState("cards");

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

  // Update toggle function to cycle through three views
  const toggleViewMode = () => {
    if (viewMode === "cards") {
      setViewMode("list");
    } else if (viewMode === "list") {
      setViewMode("calendar");
    } else {
      setViewMode("cards");
    }
  };

  // Function to get the active page name for sidebar based on viewMode
  const getActivePage = () => {
    switch (viewMode) {
      case "cards":
        return "Event Cards";
      case "list":
        return "Event List";
      case "calendar":
        return "Event Calendar";
      default:
        return "Event Cards";
    }
  };

  // Function to get the sub tab in the EventInfo
  const getActiveSubTab = () => {
    switch (viewMode) {
      case "cards":
        return "Cards";
      case "list":
        return "List";
      case "calendar":
        return "Calendar";
      default:
        return "Cards";
    }
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
      <div className="eventsContent">
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 2.5 }}>
            <SidebarNav activePage={getActivePage()} />
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
      <div className="eventsContent">
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 2.5 }}>
            <SidebarNav activePage={getActivePage()} />
          </Grid>
          <Grid size={{ xs: 12, md: 9.5 }}>
            <p>Error: {error}</p>
          </Grid>
        </Grid>
      </div>
    );
  }

  // Function to get the appropriate icon based on the current view mode
  const getViewIcon = () => {
    switch (viewMode) {
      case "cards":
        return "/assets/eventsAssets/displayTypeIcon.svg";
      case "list":
        return "/assets/eventsAssets/listView.svg";
      case "calendar":
        return "/assets/eventsAssets/calendarView.svg";
      default:
        return "/assets/eventsAssets/displayTypeIcon.svg";
    }
  };

  return (
    <div className="eventsContent">
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, md: 2.5 }}>
          <SidebarNav
            activePage={getActivePage()}
            changedTab={getActivePage()}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 9.5 }}>
          {/* start event info */}
          <EventInfo
            breadCrumbsLinkName={
              eventType === "birthdays" ? "Birthdays" : "Trips"
            }
            breadCrumbsLinkPath={
              eventType === "birthdays" ? "/birthdays" : "/trips"
            }
            breadCrumbsSubTab={getActiveSubTab()}
          />
          {/* end event info */}

          {/* content filter and search start */}
          <div className="eventsContentDisplayType">
            <div
              className="eventsContentDisplayTypeIconContainer"
              onClick={toggleViewMode}
              style={{ cursor: "pointer" }}
            >
              <img
                src={getViewIcon()}
                alt="Toggle view"
                className="eventsContentDisplayTypeIcon"
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
                className="eventsContentDisplayTypeList"
              >
                <MenuItem value={"birthdays"}>Birthdays</MenuItem>
                <MenuItem value={"trips"}>Trips</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="eventsContentSearchAndFilter">
            <div className="eventsContentSearchWrapper">
              <Paper component="form" className="eventsContentSearchContainer">
                <SearchIcon sx={{ p: 1, color: "#8c8c8c" }} />
                <InputBase
                  className="eventsContentSearch"
                  name="eventsContentSearch"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  inputProps={{ "aria-label": "search events" }}
                />
              </Paper>
            </div>
            <div className="eventsContentFilterImgContainer">
              <img
                src="/assets/eventCardsAssets/filterIcon.svg"
                alt=""
                className="eventsContentSearchAndFilterImg"
              />
            </div>
          </div>
          {/* content filter and search end */}

          {/* Conditionally render(fetching) cards or list or calendar based on viewMode start */}

          {viewMode === "cards" && (
            <EventsContentAllCards
              events={filteredEvents}
              eventType={eventType}
            />
          )}
          {viewMode === "list" && (
            <EventsContentList events={filteredEvents} eventType={eventType} />
          )}
          {viewMode === "calendar" && (
            <EventsContentCalendar
              events={filteredEvents}
              eventType={eventType}
            />
          )}

          {/* Conditionally render(fetching) cards or list or calendar based on viewMode end */}
        </Grid>
      </Grid>
    </div>
  );
}
