import Navbar from "../../navbar/Navbar";
import "./eventInfo.css";

// MUI Imports
import { Breadcrumbs, Link, Typography } from "@mui/material";

export default function EventInfo({
  breadCrumbsLinkName,
  breadCrumbsSubTab = "Cards",
  breadCrumbsLinkPath,
}) {
  return (
    <div className="eventInfo">
      <Navbar />

      {/* bread crumbs start */}
      <div className="eventInfoBreadcrumbsContainer">
        <Breadcrumbs
          aria-label="breadcrumb"
          separator="›"
          className="eventInfoBreadcrumbs"
        >
          <Link underline="hover" color="inherit" href={breadCrumbsLinkPath}>
            {breadCrumbsLinkName}
          </Link>
          <Typography style={{ color: "#4b4b4b !important" }}>
            {breadCrumbsSubTab}
          </Typography>
          <Typography style={{ color: "#4b4b4b !important" }}>Home</Typography>
        </Breadcrumbs>
      </div>
      {/* bread crumbs end */}
    </div>
  );
}
