import logo from "../assets/SWBLogo.png";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./header.css";
import { BASE_URL } from "../services/helper";
import { useAdmin } from "../admin/AdminContext";

const Header = () => {
  const [userdata, setUserdata] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout: adminLogout } = useAdmin();

  const handleNavItemClick = (link) => {
    navigate(link);
  };

  const getUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/login/success`, {
        withCredentials: true,
      });
      setUserdata(response.data);
    } catch (error) {
      // not logged in as regular user — fine
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Regular user logout
  const logout = () => {
    localStorage.clear();
    window.open(`${BASE_URL}/logout`, "_self");
  };

  // Admin logout
  const handleAdminLogout = async () => {
    await adminLogout();
    navigate("/");
  };

  // All nav items
  const allNavItems = [
    { link: "/",            title: "HOME" },
    { link: "/aboutus",     title: "ABOUT US" },
    { link: "/blogs",       title: "BLOGS" },
    { link: "/FunQuizzes",  title: "QUIZZES" },
    { link: "/appointment", title: "APPOINTMENT" },
    { link: "/contactus",   title: "CONTACT US" },
    { link: "/usefullLink", title: "USEFUL LINKS" },
  ];

  // Admin sees everything EXCEPT appointment
  const navItems = isAdmin
    ? allNavItems.filter((item) => item.link !== "/appointment")
    : allNavItems;

  const getInitials = (name) => {
    const splitName = name.toUpperCase().split(" ");
    if (splitName.length === 1) {
      return splitName[0] ? splitName[0].charAt(0) : "";
    } else {
      return splitName[0].charAt(0) + splitName[1].charAt(0);
    }
  };

  const isRegularUserLoggedIn = Object.keys(userdata).length > 0;

  return (
    <nav
      className="navbar bg-white sticky-top navbar-expand-xl header-custom"
      id="sectionsNav"
    >
      <div className="container-fluid ps-0">
        <NavLink
          className="custom-brandName navbar-brand fw-bold mx-0"
          href="/"
        >
          <img src={logo} alt="Snehita well being logo" />
          SNEHITA WELLBEING
        </NavLink>

        <button
          className="navbar-toggler my-1 mx-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"> </span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav px-1">
            {/* Main nav items (appointment hidden for admin) */}
            {navItems.map((item, index) => (
              <li
                className={`nav-item mx-1 page-nav-item-hover ${
                  location.pathname === item.link ? "page-nav-item" : ""
                }`}
                key={index}
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                onClick={() => handleNavItemClick(item.link)}
              >
                <NavLink
                  className="nav-link active fw-bold mx-1 mb-1"
                  aria-current="page"
                  to={item.link}
                >
                  {item.title}
                </NavLink>
              </li>
            ))}

            {/* Counselor-only: Analytics link */}
            {!isAdmin && userdata?.user?.role === "counselor" && (
              <li
                className={`nav-item mx-1 page-nav-item-hover ${
                  location.pathname === "/counselor/analytics"
                    ? "page-nav-item"
                    : ""
                }`}
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                onClick={() => handleNavItemClick("/counselor/analytics")}
              >
                <NavLink
                  className="nav-link active fw-bold mx-1 mb-1"
                  aria-current="page"
                  to="/counselor/analytics"
                >
                  ANALYTICS
                </NavLink>
              </li>
            )}

            {/* ── Auth buttons ── */}

            {/* CASE 1: Admin is logged in → show Admin badge + Logout */}
            {isAdmin && (
              <>
                <li className="nav-item mx-1 d-flex align-items-center">
                  <span
                    style={{
                      background: "#20b3f7",
                      color: "#fff",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "3px 12px",
                      borderRadius: "20px",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    🛡️ ADMIN
                  </span>
                </li>
                <li
                  className="nav-item mx-1 mt-2"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                >
                  <button
                    className="loginButton"
                    onClick={handleAdminLogout}
                    style={{ border: "none", cursor: "pointer" }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* CASE 2: Regular user is logged in → show Logout + Avatar */}
            {!isAdmin && isRegularUserLoggedIn && (
              <>
                <li
                  className="nav-item mx-1 cursor-pointer"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                >
                  <div
                    className="nav-link active fw-bold mx-1 cursor-pointer"
                    onClick={logout}
                    style={{ fontSize: "17px", cursor: "pointer" }}
                  >
                    Logout
                  </div>
                </li>
                <li
                  className="nav-item mx-1 cursor-pointer"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                >
                  <div
                    className="nav-link active fw-bold mx-1 cursor-pointer"
                    onClick={() => handleNavItemClick("/profile")}
                    title="View Profile"
                    style={{
                      fontSize: "17px",
                      backgroundColor: "#20b3f7",
                      color: "white",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {getInitials(userdata.user.person_name)}
                  </div>
                </li>
              </>
            )}

            {/* CASE 3: Nobody is logged in → show Login button */}
            {!isAdmin && !isRegularUserLoggedIn && (
              <li
                className="nav-item mt-2"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                onClick={() => handleNavItemClick("/login")}
              >
                <NavLink to="/login" className="loginButton">
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;