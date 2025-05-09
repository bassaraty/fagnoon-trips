import { useEffect, useState } from "react";
import { useBirthdayFormContext } from "../../../contexts/BirthdayFormContext";
import { useEventData } from "../../../contexts/EventDataContext";
import { useUserAuth } from "../../../contexts/UserAuthContext";

export default function useBirthdayLocations() {
  const { birthdayFormData, updateBirthdayFormData } = useBirthdayFormContext();
  const { currentUser } = useUserAuth();
  const { events } = useEventData();

  // Location options based on branch
  const locationOptions = {
    MOA: [
      { name: "Large Roof (Left & Right)" },
      { name: "Small Roof" },
      { name: "Pergola" },
      { name: "Treehouses" },
      { name: "Large Roof Left" },
      { name: "Large Roof Right" },
    ],
    HO: [
      { name: "Roof" },
      { name: "Pergola 1" },
      { name: "Pergola 2" },
      { name: "Pergola 3" },
      { name: "Pergola 4" },
      { name: "Extension" },
    ],
  };

  // State for tracking reserved locations for selected date
  const [reservedLocations, setReservedLocations] = useState([]);

  // State for available branches based on user role
  const [availableBranches, setAvailableBranches] = useState([]);

  // State for available locations
  const [availableLocations, setAvailableLocations] = useState([]);

  // Get available branches based on user role
  useEffect(() => {
    if (currentUser) {
      let branches = [];
      if (currentUser.role === "admin") {
        branches = [{ name: "MOA" }, { name: "HO" }];
      } else if (currentUser.role === "MOA") {
        branches = [{ name: "MOA" }];
      } else if (currentUser.role === "HO") {
        branches = [{ name: "HO" }];
      } else {
        branches = [];
      }
      setAvailableBranches(branches);

      if (branches.length === 1 && !birthdayFormData.birthdayBranch) {
        updateBirthdayFormData({ birthdayBranch: branches[0].name });
      }
    }
  }, [currentUser, updateBirthdayFormData, birthdayFormData.birthdayBranch]);

  // Fetch reserved locations when branch or date changes or when using today's date
  useEffect(() => {
    // Get today's date in mm/dd/yyyy format
    const today = new Date();
    const formattedToday = `${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;

    if (birthdayFormData.birthdayBranch) {
      const dateToCheck = birthdayFormData.birthdayDate || formattedToday;
      fetchReservedLocations(dateToCheck);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthdayFormData.birthdayBranch, birthdayFormData.birthdayDate, events]);

  // Update available locations when branch or reservations change
  useEffect(() => {
    if (birthdayFormData.birthdayBranch) {
      const branch = birthdayFormData.birthdayBranch;

      // Get all locations for this branch
      const branchLocations = locationOptions[branch] || [];

      // Apply disabled flag based on reservations
      const locations = branchLocations.map((location) => {
        const isDisabled = isLocationDisabled(location.name, reservedLocations);
        return {
          ...location,
          disabled: isDisabled,
        };
      });

      // Filter out disabled locations - they won't be displayed at all
      const availableLocs = locations.filter((loc) => !loc.disabled);

      setAvailableLocations(availableLocs);

      // Debug log to check available locations
      //   console.log("Reserved locations:", reservedLocations);
      //   console.log("All locations with disabled state:", locations);
      //   console.log("Available locations (filtered):", availableLocs);

      // If the current selected location(s) are now filtered out, clear them
      if (birthdayFormData.birthdayLocation) {
        if (branch === "HO") {
          // For HO, check if any selected locations are unavailable
          const currentLocations = Array.isArray(
            birthdayFormData.birthdayLocation
          )
            ? birthdayFormData.birthdayLocation
            : [birthdayFormData.birthdayLocation];
          const availableLocationNames = availableLocs.map((loc) => loc.name);
          const validLocations = currentLocations.filter((loc) =>
            availableLocationNames.includes(loc)
          );

          if (
            validLocations.length !== currentLocations.length &&
            !isEditingCurrentLocation()
          ) {
            updateBirthdayFormData({ birthdayLocation: validLocations });
          }
        } else {
          // For MOA, check if the single selected location is unavailable
          const isCurrentLocationAvailable = availableLocs.some(
            (loc) => loc.name === birthdayFormData.birthdayLocation
          );

          if (!isCurrentLocationAvailable && !isEditingCurrentLocation()) {
            updateBirthdayFormData({ birthdayLocation: "" });
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthdayFormData.birthdayBranch, reservedLocations]);

  // Check if we're editing the current reservation
  const isEditingCurrentLocation = () => {
    if (birthdayFormData.id) {
      const currentEvent = events.find(
        (event) => event.id === birthdayFormData.id
      );

      if (
        currentEvent &&
        currentEvent.birthdayDate === birthdayFormData.birthdayDate
      ) {
        // For HO, check if all current locations match
        if (birthdayFormData.birthdayBranch === "HO") {
          const currentLocations = Array.isArray(currentEvent.birthdayLocation)
            ? currentEvent.birthdayLocation
            : [currentEvent.birthdayLocation];
          const formLocations = Array.isArray(birthdayFormData.birthdayLocation)
            ? birthdayFormData.birthdayLocation
            : [birthdayFormData.birthdayLocation];
          return (
            currentLocations.length === formLocations.length &&
            currentLocations.every((loc) => formLocations.includes(loc))
          );
        } else {
          // For MOA, check if the single location matches
          return (
            currentEvent.birthdayLocation === birthdayFormData.birthdayLocation
          );
        }
      }
    }
    return false;
  };

  // Format date to match API format (mm/dd/yyyy)
  const formatDateToAPIFormat = (dateString) => {
    if (!dateString) return "";

    // Check if the date is already in correct format (mm/dd/yyyy)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }

    // If it's in ISO format (yyyy-mm-dd), convert it
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");
      return `${month}/${day}/${year}`;
    }

    // If we can't determine the format, create today's date
    const today = new Date();
    return `${String(today.getMonth() + 1).padStart(2, "0")}/${String(
      today.getDate()
    ).padStart(2, "0")}/${today.getFullYear()}`;
  };

  // Fetch reserved locations from EventDataContext
  const fetchReservedLocations = (selectedDate) => {
    try {
      // Default to today if no date provided
      if (!selectedDate) {
        const today = new Date();
        selectedDate = `${String(today.getMonth() + 1).padStart(
          2,
          "0"
        )}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;
      }

      // Format selected date to match API format (mm/dd/yyyy)
      const formattedSelectedDate = formatDateToAPIFormat(selectedDate);
      //   console.log(
      //     `Fetching reserved locations for date: ${formattedSelectedDate}`
      //   );
      //   console.log("All events:", events);

      // Filter events from EventDataContext to find reservations for the selected date
      const reservationsForDate = events
        .filter((event) => {
          // Ensure we have the required properties
          if (
            !event.birthdayDate ||
            !event.birthdayBranch ||
            !event.birthdayLocation
          ) {
            return false;
          }

          // Format event date to mm/dd/yyyy
          const eventDate = formatDateToAPIFormat(event.birthdayDate);

          // Match events for the selected branch and date
          return (
            eventDate === formattedSelectedDate &&
            event.birthdayBranch === birthdayFormData.birthdayBranch
          );
        })
        .flatMap((event) => {
          // Handle both array and string birthdayLocation
          return Array.isArray(event.birthdayLocation)
            ? event.birthdayLocation
            : [event.birthdayLocation];
        });

      // Apply hierarchical rules for MOA branch
      const updatedReservations = [...reservationsForDate];

      if (birthdayFormData.birthdayBranch === "MOA") {
        if (reservationsForDate.includes("Large Roof (Left & Right)")) {
          updatedReservations.push("Large Roof Left", "Large Roof Right");
        } else if (
          reservationsForDate.includes("Large Roof Left") &&
          reservationsForDate.includes("Large Roof Right")
        ) {
          updatedReservations.push("Large Roof (Left & Right)");
        }
      }

      setReservedLocations([...new Set(updatedReservations)]); // Remove duplicates
      //   console.log(
      //     `Reserved locations for ${formattedSelectedDate}:`,
      //     [...new Set(updatedReservations)]
      //   );
    } catch (error) {
      console.error("Error fetching reserved locations:", error);
      setReservedLocations([]);
    }
  };

  // Check if a location is disabled based on reservations and hierarchical rules
  const isLocationDisabled = (locationName, reservations) => {
    // Skip check if editing the current reservation
    if (isEditingCurrentLocation()) {
      return false;
    }

    // Check if the location is directly reserved
    if (reservations.includes(locationName)) {
      return true;
    }

    // Apply hierarchical rules for MOA branch
    if (birthdayFormData.birthdayBranch === "MOA") {
      if (
        locationName === "Large Roof (Left & Right)" &&
        (reservations.includes("Large Roof Left") ||
          reservations.includes("Large Roof Right"))
      ) {
        return true;
      }
      if (
        (locationName === "Large Roof Left" ||
          locationName === "Large Roof Right") &&
        reservations.includes("Large Roof (Left & Right)")
      ) {
        return true;
      }
    }

    return false;
  };

  // Handle branch selection
  const handleBirthdayBranchSelection = (e) => {
    const newBranch = e.target.value;
    updateBirthdayFormData({
      birthdayBranch: newBranch,
      birthdayLocation: newBranch === "HO" ? [] : "", // Initialize as array for HO, string for MOA
    });
  };

  // Handle location selection
  const handleBirthdayLocationSelection = (e) => {
    const value = e.target.value;
    if (birthdayFormData.birthdayBranch === "HO") {
      // For HO, value is an array from checkboxes
      updateBirthdayFormData({ birthdayLocation: value });
    } else {
      // For MOA, value is a string from radio buttons
      updateBirthdayFormData({ birthdayLocation: value });
    }
  };

  return {
    availableBranches,
    availableLocations,
    reservedLocations,
    handleBirthdayBranchSelection,
    handleBirthdayLocationSelection,
  };
}
