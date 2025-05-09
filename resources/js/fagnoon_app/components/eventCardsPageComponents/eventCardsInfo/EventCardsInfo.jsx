import "./eventCardsInfo.css";

// MUI Imports
import { Breadcrumbs, Link, Typography } from "@mui/material";

export default function EventCardsInfo({
  breadCrumbsLinkName,
  breadCrumbsLinkPath,
}) {
  return (
    <div className="eventCardsInfo">
      <div className="eventCardsInfoUserContainer">
        <div className="eventCardsInfoUserTime">
          <div className="eventCardsInfoUserTimeImgContainer">
            <img
              src="/assets/tripAssets/tripInfo1.svg"
              alt=""
              className="eventCardsInfoUserTimeImg"
            />
          </div>
          <p className="eventCardsInfoUserTimeText">00:00</p>
        </div>

        <div className="eventCardsInfoUserDate">
          <div className="eventCardsInfoUserDateImgContainer">
            <img
              src="/assets/tripAssets/tripInfo2.svg"
              alt=""
              className="eventCardsInfoUserDateImg"
            />
          </div>
          <p className="eventCardsInfoUserDateText">25/3/2025</p>
        </div>

        <div className="eventCardsInfoUsername">
          <div className="eventCardsInfoUsernameProfileContainer">
            <img
              src="/assets/tripAssets/1.jpeg"
              alt=""
              className="eventCardsInfoUsernameProfile"
            />
          </div>
          <p className="eventCardsInfoUsernameText">Username</p>
        </div>
      </div>

      {/* bread crumbs start */}
      <div className="eventCardsInfoBreadcrumbsContainer">
        <Breadcrumbs
          aria-label="breadcrumb"
          separator="›"
          className="eventCardsInfoBreadcrumbs"
        >
          <Link underline="hover" color="inherit" href={breadCrumbsLinkPath}>
            {breadCrumbsLinkName}
          </Link>
          <Typography style={{ color: "#4b4b4b !important" }}>Cards</Typography>
          <Typography style={{ color: "#4b4b4b !important" }}>Home</Typography>
        </Breadcrumbs>
      </div>
      {/* bread crumbs end */}
    </div>
  );
}
