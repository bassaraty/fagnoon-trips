import "./navbar.css";
// Context Imports
import { useUserAuth } from "../../contexts/UserAuthContext";

export default function Navbar() {
  // Get the signOut function from the auth context
  const { signOut } = useUserAuth();

  // Handle sign out click
  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="navbar">
      <div className="navbarInfoUserContainer">
        <div className="navbarInfoUserTime">
          <div className="navbarInfoUserTimeImgContainer">
            <img
              src="/assets/notification.svg"
              alt=""
              className="navbarInfoUserTimeImg"
            />
          </div>
          {/* <p className="navbarInfoUserTimeText">00:00</p> */}
        </div>

        <div className="navbarInfoUserTime">
          <div className="navbarInfoUserTimeImgContainer">
            <img
              src="/assets/tripAssets/tripInfo1.svg"
              alt=""
              className="navbarInfoUserTimeImg"
            />
          </div>
          <p className="navbarInfoUserTimeText">00:00</p>
        </div>

        <div className="navbarInfoUserDate">
          <div className="navbarInfoUserDateImgContainer">
            <img
              src="/assets/tripAssets/tripInfo2.svg"
              alt=""
              className="navbarInfoUserDateImg"
            />
          </div>
          <p className="navbarInfoUserDateText">25/3/2025</p>
        </div>

        <div className="navbarInfoUsername">
          <div className="navbarInfoUsernameProfileContainer">
            <img
              src="/assets/tripAssets/1.jpeg"
              alt=""
              className="navbarInfoUsernameProfile"
            />
          </div>
          <p className="navbarInfoUsernameText">Username</p>
        </div>

        <div className="navbarInfoUsername" onClick={handleSignOut}>
          <div className="navbarInfoUsernameProfileContainer">
            <img
              src="/assets/power-off 1.svg"
              alt=""
              className="navbarInfoUserTimeImg"
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
