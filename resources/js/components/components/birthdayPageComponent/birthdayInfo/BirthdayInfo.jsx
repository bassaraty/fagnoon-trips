import Navbar from "../../navbar/Navbar";
import "./birthdayInfo.css";

// MUI Imports
import { Breadcrumbs, Link, Typography } from "@mui/material";

export default function BirthdayInfo() {
  return (
    <div className="birthdayInfo">
      <Navbar />

      {/* bread crumbs start */}
      <div className="birthdayInfoBreadcrumbsContainer">
        <Breadcrumbs
          aria-label="breadcrumb"
          separator="›"
          className="birthdayInfoBreadcrumbs"
        >
          <Link underline="hover" color="inherit" href="/birthdays">
            Birthday
          </Link>
          <Typography style={{ color: "#4b4b4b" }}>Home</Typography>
        </Breadcrumbs>
      </div>
      {/* bread crumbs end */}

      {/* page title start */}
      <h1 className="birthdayInfoTitle">Birthday Creation</h1>
      {/* page title end */}
    </div>
  );
}
