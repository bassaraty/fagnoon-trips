import { useEffect, useState } from "react";
import "./eventsContentCalendar.css";

// External Libraries
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export default function EventsContentCalendar({ events, eventType }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  const [viewType, setViewType] = useState("month"); // "month", "week", or "day"
  const [weekDays, setWeekDays] = useState([]);
  const [hourlySlots, setHourlySlots] = useState([]);

  // Month names array
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Day names array
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar days for the current month
  useEffect(() => {
    if (viewType === "month") {
      generateCalendarDays();
    } else if (viewType === "week") {
      generateWeekDays();
    } else if (viewType === "day") {
      generateHourlySlots();
    }
  }, [currentDate, viewType]);

  // Parse time string to get hour in 24-hour format
  const parseTimeToHour = (timeString) => {
    if (!timeString) return 0;

    // Check if time contains AM/PM format
    if (timeString.includes("AM") || timeString.includes("PM")) {
      const [timePart, meridiem] = timeString.split(" ");
      // eslint-disable-next-line no-unused-vars
      let [hours, minutes] = timePart.split(":").map(Number);

      // Convert 12-hour format to 24-hour format
      if (meridiem === "PM" && hours !== 12) {
        hours += 12;
      } else if (meridiem === "AM" && hours === 12) {
        hours = 0;
      }

      return hours;
    } else {
      // Handle 24-hour format (HH:MM)
      return parseInt(timeString.split(":")[0]);
    }
  };

  // Format time for display
  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return "";

    // If already in AM/PM format, return as is
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }

    // Convert from 24-hour format to AM/PM
    const [hours, minutes] = timeString.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const startingDayOfWeek = firstDay.getDay();

    // Calculate days from previous month to display
    const daysFromPrevMonth = startingDayOfWeek;
    // Calculate total days in current month
    const daysInMonth = lastDay.getDate();

    // Calculate total cells needed (previous month days + current month days + next month days)
    // We want 5 weeks (35 days) or 6 weeks (42 days) depending on the month
    const totalDays = Math.ceil((daysFromPrevMonth + daysInMonth) / 7) * 7;

    const calendarDaysArray = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < daysFromPrevMonth; i++) {
      const day = prevMonthLastDay - daysFromPrevMonth + i + 1;
      const date = new Date(year, month - 1, day);
      calendarDaysArray.push({
        date,
        day,
        isCurrentMonth: false,
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0)),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      calendarDaysArray.push({
        date,
        day: i,
        isCurrentMonth: true,
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0)),
      });
    }

    // Next month days
    const remainingCells = totalDays - calendarDaysArray.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      calendarDaysArray.push({
        date,
        day: i,
        isCurrentMonth: false,
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0)),
      });
    }

    setCalendarDays(calendarDaysArray);
  };

  const generateWeekDays = () => {
    const weekDaysArray = [];

    // Get the start of the week (Sunday)
    const currentDay = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDay);

    // Generate 7 days for the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      weekDaysArray.push({
        date,
        day: date.getDate(),
        dayOfWeek: i,
        month: date.getMonth(),
        year: date.getFullYear(),
        isToday: isSameDay(date, new Date()),
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0)),
      });
    }

    setWeekDays(weekDaysArray);
  };

  const generateHourlySlots = () => {
    const hoursArray = [];

    // Generate 24 hours for the day
    for (let i = 0; i < 24; i++) {
      hoursArray.push({
        hour: i,
        displayHour:
          i === 0
            ? "12 AM"
            : i < 12
            ? `${i} AM`
            : i === 12
            ? "12 PM"
            : `${i - 12} PM`,
      });
    }

    setHourlySlots(hoursArray);
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Format date to MM/DD/YYYY for comparison with event dates
  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const formattedDate = formatDate(date);

    return events.filter((event) => {
      const eventDate =
        eventType === "birthdays" ? event.birthdayDate : event.tripDate;

      return eventDate === formattedDate;
    });
  };

  // Get events for a specific hour on a specific date
  const getEventsForDateAndHour = (date, hour) => {
    const dateEvents = getEventsForDate(date);

    return dateEvents.filter((event) => {
      const startTime =
        eventType === "birthdays"
          ? event.birthdayStartTime
          : event.tripStartTime;

      const startHour = parseTimeToHour(startTime);
      return startHour === hour;
    });
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Switch view functions
  const switchToMonthView = () => {
    setViewType("month");
  };

  const switchToWeekView = () => {
    setViewType("week");
  };

  const switchToDayView = () => {
    setViewType("day");
  };

  return (
    <div className="eventsContentCalendar">
      <div className="calendarHeader">
        <div className="calendarTitle">
          {viewType === "month" && (
            <h2>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          )}
          {viewType === "week" && (
            <h2>
              Week of {weekDays.length > 0 ? formatDate(weekDays[0].date) : ""}
            </h2>
          )}
          {viewType === "day" && (
            <h2>
              {monthNames[currentDate.getMonth()]} {currentDate.getDate()},{" "}
              {currentDate.getFullYear()}
            </h2>
          )}
        </div>
        <div className="viewTypeButtons">
          <button
            onClick={switchToMonthView}
            className={`viewButton ${viewType === "month" ? "activeView" : ""}`}
          >
            Month
          </button>
          <button
            onClick={switchToWeekView}
            className={`viewButton ${viewType === "week" ? "activeView" : ""}`}
          >
            Week
          </button>
          <button
            onClick={switchToDayView}
            className={`viewButton ${viewType === "day" ? "activeView" : ""}`}
          >
            Day
          </button>
        </div>
        <div className="calendarNavigation">
          {viewType === "month" && (
            <>
              <button onClick={goToPreviousMonth} className="navButton">
                &lt; Prev
              </button>
              <button onClick={goToToday} className="todayButton">
                Today
              </button>
              <button onClick={goToNextMonth} className="navButton">
                Next &gt;
              </button>
            </>
          )}
          {viewType === "week" && (
            <>
              <button onClick={goToPreviousWeek} className="navButton">
                &lt; Prev
              </button>
              <button onClick={goToToday} className="todayButton">
                Today
              </button>
              <button onClick={goToNextWeek} className="navButton">
                Next &gt;
              </button>
            </>
          )}
          {viewType === "day" && (
            <>
              <button onClick={goToPreviousDay} className="navButton">
                &lt; Prev
              </button>
              <button onClick={goToToday} className="todayButton">
                Today
              </button>
              <button onClick={goToNextDay} className="navButton">
                Next &gt;
              </button>
            </>
          )}
        </div>
      </div>

      {/* Month View */}
      {viewType === "month" && (
        <div className="calendarGrid">
          {/* Calendar header with day names */}
          <div className="calendarDayNames">
            {dayNames.map((day) => (
              <div key={day} className="dayName">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="calendarDays">
            {calendarDays.map((calendarDay, index) => {
              const dateEvents = getEventsForDate(calendarDay.date);

              return (
                <div
                  key={index}
                  className={`calendarDay ${
                    !calendarDay.isCurrentMonth ? "otherMonth" : ""
                  } 
                  ${calendarDay.isPast ? "pastDay" : ""}
                  ${isSameDay(calendarDay.date, new Date()) ? "today" : ""}`}
                  onClick={() => {
                    setSelectedDate(calendarDay.date);
                    // Optionally switch to day view when clicking on a date
                    // setViewType("day");
                    // setCurrentDate(calendarDay.date);
                  }}
                >
                  <div className="dayNumber">{calendarDay.day}</div>
                  <div className="dayEvents">
                    {dateEvents.length > 0 &&
                      dateEvents.slice(0, 3).map((event, eventIndex) => {
                        const eventName =
                          eventType === "birthdays"
                            ? event.birthdayName
                            : event.tripName;

                        const paymentStatus =
                          eventType === "birthdays"
                            ? event.birthdayPaymentStatus
                            : "paid"; // Default for trips if not available

                        const eventStatusColor =
                          paymentStatus === "paid" ? "#44a047" : "#ff181c";

                        return (
                          <div
                            key={eventIndex}
                            className="eventIndicator"
                            style={{ backgroundColor: eventStatusColor }}
                          >
                            <span className="eventName">{eventName}</span>
                          </div>
                        );
                      })}
                    {dateEvents.length > 3 && (
                      <div className="moreEvents">
                        +{dateEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {viewType === "week" && (
        <div className="weekViewContainer">
          <div className="weekViewHeader">
            <div className="weekViewTimeSlot"></div>{" "}
            {/* Empty cell for time column */}
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={`weekViewHeaderDay ${day.isToday ? "today" : ""} ${
                  day.isPast ? "pastDay" : ""
                }`}
                onClick={() => {
                  setCurrentDate(day.date);
                  setViewType("day");
                }}
              >
                <div className="weekDayName">{dayNames[day.dayOfWeek]}</div>
                <div className="weekDayNumber">{day.day}</div>
              </div>
            ))}
          </div>

          <div className="weekViewBody">
            {hourlySlots.map((slot, index) => (
              <div key={index} className="weekViewRow">
                <div className="weekViewTime">{slot.displayHour}</div>
                {weekDays.map((day, dayIndex) => {
                  const dateEvents = getEventsForDateAndHour(
                    day.date,
                    slot.hour
                  );

                  return (
                    <div
                      key={dayIndex}
                      className={`weekViewCell ${day.isToday ? "today" : ""} ${
                        day.isPast ? "pastDay" : ""
                      }`}
                    >
                      {dateEvents.length > 0 && (
                        <div className="weekViewEvents">
                          {dateEvents.map((event, eventIndex) => {
                            const eventName =
                              eventType === "birthdays"
                                ? event.birthdayName
                                : event.tripName;
                            const paymentStatus =
                              eventType === "birthdays"
                                ? event.birthdayPaymentStatus
                                : "paid";
                            const eventStatusColor =
                              paymentStatus === "paid" ? "#44a047" : "#ff181c";

                            return (
                              <div
                                key={eventIndex}
                                className="weekEventIndicator"
                                style={{ backgroundColor: eventStatusColor }}
                                onClick={() => setSelectedDate(day.date)}
                              >
                                <span className="eventName">{eventName}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day View */}
      {viewType === "day" && (
        <div className="dayViewContainer">
          <div className="dayViewHeader">
            <div className="dayViewDate">
              {dayNames[currentDate.getDay()]},{" "}
              {monthNames[currentDate.getMonth()]} {currentDate.getDate()}
            </div>
          </div>

          <div className="dayViewBody">
            {hourlySlots.map((slot, index) => {
              const hourEvents = getEventsForDateAndHour(
                currentDate,
                slot.hour
              );

              return (
                <div key={index} className="dayViewRow">
                  <div className="dayViewTime">{slot.displayHour}</div>
                  <div className="dayViewCell">
                    {hourEvents.length > 0 && (
                      <div className="dayViewEvents">
                        {hourEvents.map((event, eventIndex) => {
                          const eventName =
                            eventType === "birthdays"
                              ? event.birthdayName
                              : event.tripName;
                          const location =
                            eventType === "birthdays"
                              ? event.birthdayLocation
                              : event.tripLocation;
                          const paymentStatus =
                            eventType === "birthdays"
                              ? event.birthdayPaymentStatus
                              : "paid";
                          const eventStatusColor =
                            paymentStatus === "paid" ? "#44a047" : "#ff181c";

                          return (
                            <div
                              key={eventIndex}
                              className="dayEventIndicator"
                              style={{ backgroundColor: eventStatusColor }}
                              onClick={() => setSelectedDate(currentDate)}
                            >
                              <div className="dayEventName">{eventName}</div>
                              <div className="dayEventLocation">{location}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event details section when a date is selected */}
      {selectedDate && (
        <div className="selectedDateEvents">
          <h3>Events on {formatDate(selectedDate)}</h3>
          {getEventsForDate(selectedDate).length > 0 ? (
            <div className="eventsList">
              {getEventsForDate(selectedDate).map((event, index) => {
                const eventName =
                  eventType === "birthdays"
                    ? event.birthdayName
                    : event.tripName;

                const location =
                  eventType === "birthdays"
                    ? event.birthdayLocation
                    : event.tripLocation;

                const startTime =
                  eventType === "birthdays"
                    ? event.birthdayStartTime
                    : event.tripStartTime;

                const endTime =
                  eventType === "birthdays"
                    ? event.birthdayEndTime
                    : event.tripEndTime;

                const paymentStatus =
                  eventType === "birthdays"
                    ? event.birthdayPaymentStatus
                    : "paid"; // Default for trips

                return (
                  <div key={index} className="eventDetail">
                    <div className="eventHeader">
                      <span className={`eventStatus ${paymentStatus}`}></span>
                      <h4>{eventName}</h4>
                    </div>
                    <div className="eventInfo">
                      <p>
                        <strong>Location:</strong> {location}
                      </p>
                      <p>
                        <strong>Time:</strong> {formatTimeForDisplay(startTime)}{" "}
                        - {formatTimeForDisplay(endTime)}
                      </p>
                      <p>
                        <strong>Status:</strong> {paymentStatus}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>
              No events on this date.{" "}
              <Link to={`/${eventType}`}>
                <Button variant="text">Add Event</Button>
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
