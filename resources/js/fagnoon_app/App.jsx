import "./App.css";
import { useUserAuth } from "./contexts/UserAuthContext";

// Material UI Theme
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// External Libraries
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

// Components Imports
import { AttendanceMenuProvider } from "./contexts/AttendanceMenuContext";
import { BirthdayFormProvider } from "./contexts/BirthdayFormContext";
import { EventDataProvider } from "./contexts/EventDataContext";
import { TripFormProvider } from "./contexts/TripFormContext";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import AttendanceMenu from "./pages/attendanceMenu/AttendanceMenu";
import Birthday from "../Pages/Birthdays/Birthday";
import Events from "./pages/events/Events";
import SignIn from "./pages/signIn/SignIn";
import Trips from "../Pages/Trips/Trips";

const theme = createTheme({
  // typography: {
  //   fontFamily: ["IBM"],
  // },
  palette: {
    primary: {
      main: "#EF585C",
    },
  },
});

function AppRoutes() {
  const { currentUser, loading } = useUserAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#EF585C !important" }} />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public route - Sign In */}
        <Route
          path="/"
          element={currentUser ? <Navigate to="/trips" /> : <SignIn />}
        />

        {/* Protected routes - require authentication but accessible by all roles */}
        <Route
          path="/trips"
          element={currentUser ? <Trips /> : <Navigate to="/" />}
        />

        <Route
          path="/birthdays"
          element={currentUser ? <Birthday /> : <Navigate to="/" />}
        />

        <Route
          path="/events"
          element={currentUser ? <Events /> : <Navigate to="/" />}
        />

        <Route
          path="/attendance-menu"
          element={currentUser ? <AttendanceMenu /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserAuthProvider>
        <EventDataProvider>
          <BirthdayFormProvider>
            <TripFormProvider>
              <AttendanceMenuProvider>
                <AppRoutes />
              </AttendanceMenuProvider>
            </TripFormProvider>
          </BirthdayFormProvider>
        </EventDataProvider>
      </UserAuthProvider>
    </ThemeProvider>
  );
}

export default App;
