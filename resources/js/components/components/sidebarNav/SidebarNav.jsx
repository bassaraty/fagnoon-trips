import "./sidebarNav.css";

// MUI Imports

// External Libraries
import { Link } from "react-router-dom";

export default function SidebarNav({
  activePage = "Trips",
  changedTab = "Event Cards",
}) {
  return (
    <div className="sidebarNav">
      <div className="sidebarNavContainer">
        <div className="sidebarNavImgContainer">
          <img src="/assets/navLogo.svg" alt="" className="sidebarNavImg" />
        </div>
        <div className="sidebarNavTabs">
          <div
            className={`sidebarNavTab ${
              activePage == "Trips" ? "activeSidebarNavTab" : ""
            }`}
          >
            <div className="sidebarNavTabImgContainer">
              <img
                src={`${
                  activePage == "Trips"
                    ? "/assets/navTabActive1.svg"
                    : "/assets/navTab1.svg"
                }`}
                alt=""
                className="sidebarNavTabImg"
              />
            </div>
            <Link to="/trips" className="sidebarNavTabLink">
              <p
                className={`sidebarNavTabTitle ${
                  activePage == "Trips" ? "sidebarNavTabTitleActive" : ""
                }`}
              >
                Trips
              </p>
            </Link>
          </div>

          <div
            className={`sidebarNavTab ${
              activePage == "Birthdays" ? "activeSidebarNavTab" : ""
            }`}
          >
            <div className="sidebarNavTabImgContainer">
              <img
                src={`${
                  activePage == "Birthdays"
                    ? "/assets/navTabActive2.svg"
                    : "/assets/navTab2.svg"
                }`}
                alt=""
                className="sidebarNavTabImg"
              />
            </div>
            <Link to="/birthdays" className="sidebarNavTabLink">
              <p
                className={`sidebarNavTabTitle ${
                  activePage == "Birthdays" ? "sidebarNavTabTitleActive" : ""
                }`}
              >
                Birthdays
              </p>
            </Link>
          </div>

          <div
            className={`sidebarNavTab ${
              activePage == changedTab ? "activeSidebarNavTab" : ""
            }`}
          >
            <div className="sidebarNavTabImgContainer">
              <img
                src={`${
                  activePage == changedTab
                    ? "/assets/navTabActive3.svg"
                    : "/assets/navTab3.svg"
                }`}
                alt=""
                className="sidebarNavTabImg"
              />
            </div>
            <Link to="/events" className="sidebarNavTabLink">
              <p
                className={`sidebarNavTabTitle ${
                  activePage == changedTab ? "sidebarNavTabTitleActive" : ""
                }`}
              >
                {changedTab}
              </p>
            </Link>
          </div>

          <div
            className={`sidebarNavTab ${
              activePage == "Attendance Menu" ? "activeSidebarNavTab" : ""
            }`}
          >
            <div className="sidebarNavTabImgContainer">
              <img
                src={`${
                  activePage == "Attendance Menu"
                    ? "/assets/navTabActive4.svg"
                    : "/assets/navTab4.svg"
                }`}
                alt=""
                className="sidebarNavTabImg"
              />
            </div>
            <Link to="/attendance-menu" className="sidebarNavTabLink">
              <p
                className={`sidebarNavTabTitle ${
                  activePage == "Attendance Menu"
                    ? "sidebarNavTabTitleActive"
                    : ""
                }`}
              >
                Attendance Menu
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
