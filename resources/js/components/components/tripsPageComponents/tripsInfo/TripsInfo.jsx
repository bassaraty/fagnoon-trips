import Navbar from "../../navbar/Navbar";
import "./tripsInfo.css";

// MUI Imports
import { Breadcrumbs, Link, Typography } from "@mui/material";

export default function TripsInfo() {
  return (
    <div className="tripsInfo">
      <Navbar />

      {/* bread crumbs start */}
      <div className="tripsInfoBreadcrumbsContainer">
        <Breadcrumbs
          aria-label="breadcrumb"
          separator="›"
          className="tripsInfoBreadcrumbs"
        >
          <Link underline="hover" color="inherit" href="/trips">
            Trips
          </Link>
          <Typography style={{ color: "#4b4b4b !important" }}>Home</Typography>
        </Breadcrumbs>
      </div>
      {/* bread crumbs end */}

      {/* page title start */}
      <h1 className="tripsInfoTitle">Trips Creation</h1>
      {/* page title end */}
    </div>
  );
}
