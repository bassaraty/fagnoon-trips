import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useContext, createContext } from "react";
function SidebarNav({
  activePage = "Trips",
  changedTab = "Event Cards"
}) {
  return /* @__PURE__ */ jsx("div", { className: "sidebarNav", children: /* @__PURE__ */ jsxs("div", { className: "sidebarNavContainer", children: [
    /* @__PURE__ */ jsx("div", { className: "sidebarNavImgContainer", children: /* @__PURE__ */ jsx("img", { src: "/assets/navLogo.svg", alt: "", className: "sidebarNavImg" }) }),
    /* @__PURE__ */ jsxs("div", { className: "sidebarNavTabs", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `sidebarNavTab ${activePage == "Trips" ? "activeSidebarNavTab" : ""}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "sidebarNavTabImgContainer", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: `${activePage == "Trips" ? "/assets/navTabActive1.svg" : "/assets/navTab1.svg"}`,
                alt: "",
                className: "sidebarNavTabImg"
              }
            ) }),
            /* @__PURE__ */ jsx(Link, { to: "/trips", className: "sidebarNavTabLink", children: /* @__PURE__ */ jsx(
              "p",
              {
                className: `sidebarNavTabTitle ${activePage == "Trips" ? "sidebarNavTabTitleActive" : ""}`,
                children: "Trips"
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `sidebarNavTab ${activePage == "Birthdays" ? "activeSidebarNavTab" : ""}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "sidebarNavTabImgContainer", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: `${activePage == "Birthdays" ? "/assets/navTabActive2.svg" : "/assets/navTab2.svg"}`,
                alt: "",
                className: "sidebarNavTabImg"
              }
            ) }),
            /* @__PURE__ */ jsx(Link, { to: "/birthdays", className: "sidebarNavTabLink", children: /* @__PURE__ */ jsx(
              "p",
              {
                className: `sidebarNavTabTitle ${activePage == "Birthdays" ? "sidebarNavTabTitleActive" : ""}`,
                children: "Birthdays"
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `sidebarNavTab ${activePage == changedTab ? "activeSidebarNavTab" : ""}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "sidebarNavTabImgContainer", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: `${activePage == changedTab ? "/assets/navTabActive3.svg" : "/assets/navTab3.svg"}`,
                alt: "",
                className: "sidebarNavTabImg"
              }
            ) }),
            /* @__PURE__ */ jsx(Link, { to: "/events", className: "sidebarNavTabLink", children: /* @__PURE__ */ jsx(
              "p",
              {
                className: `sidebarNavTabTitle ${activePage == changedTab ? "sidebarNavTabTitleActive" : ""}`,
                children: changedTab
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `sidebarNavTab ${activePage == "Attendance Menu" ? "activeSidebarNavTab" : ""}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "sidebarNavTabImgContainer", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: `${activePage == "Attendance Menu" ? "/assets/navTabActive4.svg" : "/assets/navTab4.svg"}`,
                alt: "",
                className: "sidebarNavTabImg"
              }
            ) }),
            /* @__PURE__ */ jsx(Link, { to: "/attendance-menu", className: "sidebarNavTabLink", children: /* @__PURE__ */ jsx(
              "p",
              {
                className: `sidebarNavTabTitle ${activePage == "Attendance Menu" ? "sidebarNavTabTitleActive" : ""}`,
                children: "Attendance Menu"
              }
            ) })
          ]
        }
      )
    ] })
  ] }) });
}
const UserAuthContext = createContext();
const useUserAuth = () => {
  return useContext(UserAuthContext);
};
function Navbar() {
  const { signOut } = useUserAuth();
  const handleSignOut = () => {
    signOut();
  };
  return /* @__PURE__ */ jsx("div", { className: "navbar", children: /* @__PURE__ */ jsxs("div", { className: "navbarInfoUserContainer", children: [
    /* @__PURE__ */ jsx("div", { className: "navbarInfoUserTime", children: /* @__PURE__ */ jsx("div", { className: "navbarInfoUserTimeImgContainer", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "/assets/notification.svg",
        alt: "",
        className: "navbarInfoUserTimeImg"
      }
    ) }) }),
    /* @__PURE__ */ jsxs("div", { className: "navbarInfoUserTime", children: [
      /* @__PURE__ */ jsx("div", { className: "navbarInfoUserTimeImgContainer", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/assets/tripAssets/tripInfo1.svg",
          alt: "",
          className: "navbarInfoUserTimeImg"
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "navbarInfoUserTimeText", children: "00:00" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "navbarInfoUserDate", children: [
      /* @__PURE__ */ jsx("div", { className: "navbarInfoUserDateImgContainer", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/assets/tripAssets/tripInfo2.svg",
          alt: "",
          className: "navbarInfoUserDateImg"
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "navbarInfoUserDateText", children: "25/3/2025" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "navbarInfoUsername", children: [
      /* @__PURE__ */ jsx("div", { className: "navbarInfoUsernameProfileContainer", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/assets/tripAssets/1.jpeg",
          alt: "",
          className: "navbarInfoUsernameProfile"
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "navbarInfoUsernameText", children: "Username" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "navbarInfoUsername", onClick: handleSignOut, children: /* @__PURE__ */ jsx("div", { className: "navbarInfoUsernameProfileContainer", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "/assets/power-off 1.svg",
        alt: "",
        className: "navbarInfoUserTimeImg",
        style: { cursor: "pointer" }
      }
    ) }) })
  ] }) });
}
export {
  Navbar as N,
  SidebarNav as S,
  useUserAuth as u
};
