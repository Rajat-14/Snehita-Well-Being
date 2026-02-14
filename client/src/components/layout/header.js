// import { Fragment } from "react"
import logo from "../assets/SWBLogo.png";
import React, { useEffect, useState } from "react";
// import "./Login.css"
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./header.css";
import { BASE_URL } from "../services/helper";
// const handleNavLinkClick = () => {
//   // Your custom logic here
//   console.log("Piyush");
// };

const Header = () => {
  const [userdata, setUserdata] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const handleNavItemClick = (link) => {
    navigate(link); // Programmatically navigate to the specified link
  };
  console.log(location.pathname);
  const getUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/login/success`, {
        withCredentials: true,
      });

      setUserdata(response.data);
      console.log("xfffg", response.data.user.person_name);
      const name = response.data.user.person_name;
    } catch (error) {
      console.log("error", error);
    }
  };

  // logoout
  
  useEffect(() => {
    getUser();
  }, []);
  
  const logout = () => {
    window.open(`${BASE_URL}/logout`, "_self");
  };
  const navItems = [
    {
      link: "/",
      title: "HOME",
    },
    {
      link: "/aboutus",
      title: "ABOUT US",
    },
    {
      link: "/blogs",
      title: "BLOGS",
    },
    {
      link: "/FunQuizzes",
      title: "QUIZZES",
    },
    {
      link: "/appointment",
      title: "APPOINTMENT",
    },
    {
      link: "/contactus",
      title: "CONTACT US",
    },
    {
      link: "/usefullLink",
      title: "USEFUL LINKS",
    },
  ];

  const getInitials = (name) => {
    const splitName = name.toUpperCase().split(' ');
    if (splitName.length === 1) {
      return splitName[0] ? splitName[0].charAt(0) : '';
    } else {
      return splitName[0].charAt(0) + splitName[1].charAt(0);
    }
  }
  return (
    <nav
      className="navbar bg-white sticky-top navbar-expand-xl  header-custom"
      id="sectionsNav"
    >
      <div className="container-fluid ps-0  ">
        <NavLink
          className="custom-brandName navbar-brand  fw-bold  mx-0 "
          href="/"
        >
          <img src={logo} alt="Snehita well being logo" />
          SNEHITA WELLBEING
        </NavLink>
        <button
          className="navbar-toggler my-1 mx-0  "
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
          <ul className="navbar-nav px-1  ">
            {navItems.map((item, index) => {
              return (
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
                    className="nav-link active fw-bold mx-1 mb-1 "
                    aria-current="page"
                    to={item.link}
                  >
                    {item.title}
                  </NavLink>
                </li>
              );
            })}
            {Object.keys(userdata).length > 0 ? (
              <>
              
                    
                <li className="nav-item mx-1 cursor-pointer"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent" >
                  <div
                    className="nav-link active fw-bold mx-1 cursor-pointer"
                    onClick={logout}
                    style={{ fontSize: "17px", cursor: "pointer" }}
                  >
                    Logout
                  </div>
                </li>
                <li className="nav-item mx-1">
                  <div
                    className="nav-link active fw-bold mx-1 cursor-pointer"
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
            ) : (
              <li className="nav-item  mt-2  " 
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              onClick={() => handleNavItemClick("/login")}>
                <NavLink
                  to="/login"
                  className="loginButton" // Add the class for styling
                  // onClick={handleNavLinkClick}
                >
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