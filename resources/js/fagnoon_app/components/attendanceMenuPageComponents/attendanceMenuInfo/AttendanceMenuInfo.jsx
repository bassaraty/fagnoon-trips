import Navbar from "../../navbar/Navbar";
import "./attendanceMenuInfo.css";

// MUI Imports
import { Breadcrumbs, Link, Typography } from "@mui/material";

export default function AttendanceMenuInfo() {
  return (
    <div className="attendanceMenuInfo">
      <Navbar />

      {/* bread crumbs start */}
      <div className="attendanceMenuInfoBreadcrumbsContainer">
        <Breadcrumbs
          aria-label="breadcrumb"
          separator="›"
          className="attendanceMenuInfoBreadcrumbs"
        >
          <Link underline="hover" color="inherit" href="/attendance-menu">
            Attendance menu
          </Link>
          <Typography style={{ color: "#4b4b4b !important" }}>
            Birthday
          </Typography>
          <Typography style={{ color: "#4b4b4b !important" }}>Home</Typography>
        </Breadcrumbs>
      </div>
      {/* bread crumbs end */}

      {/* page title start */}
      <h1 className="attendanceMenuInfoTitle">Attendance menu Creation</h1>
      {/* page title end */}
    </div>
  );
}
