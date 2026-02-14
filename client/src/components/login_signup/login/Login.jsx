import React, { useState } from "react";
import "../../login_signup/login_signup.css";
import { NavLink, redirect, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
// import { sentOtpFunction } from "../services/Apis";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../../services/helper";
import axios from "axios";

const Login = (props) => {
  // let time = props.chk.date.toLocaleString('en-US',{month:'long'})
  // let year = props.chk.date.getFullYear()
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chk = location.state ? location.state.chk : null;
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  let [input, setinput] = useState({
    email: "",
    password: "",
  });
  let fnct2 = (event) => {
    let { name, value } = event.target;
    setinput({ ...input, [name]: value });
  };

  // console.log(val);
  // const handleChange = (event) => {
  //   setEmail(event.target.value);
  // };

  const login = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (!input.email || !input.password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/user/login`, input, {
        withCredentials: true,
      });
      toast.success("Login successful");

      console.log("logged in");

      // Delay the redirection by 2 seconds
      setTimeout(() => {
        window.location.href = "/"; // Redirect to home page
      }, 1500);
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false); // Stop form submission
    }
  };

  return (
    <>
      <section>
        <div className="form_group">
          <div className="header_form">
            <h1>Login</h1>
            <p>welcome to login page</p>
          </div>
          <form>
            <div className="enter_in_form">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                onChange={fnct2}
                placeholder="Enter your email"
              />
            </div>
            <div className="enter_in_form">
              <label htmlFor="email">Password</label>
              <input
                type="password"
                name="password"
                onChange={fnct2}
                placeholder="Enter your password"
              />
            </div>
            <div
              className="text-center"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                paddingTop: "0.1rem",
              }}
              data-testid="forgot"
            >
              <div style={{ marginBottom: "0.5rem" }}>
                <NavLink
                  to="/email"
                  style={{
                    color: "#31363F",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: "light",
                  }}
                >
                  Forgot Password
                </NavLink>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={login}
              className="btn"
            >
              {isSubmitting && <div className="spinner"></div>}
              {isSubmitting ? "Logging..." : "Login"}
            </button>

            <p className="txt">
              Don't have account <NavLink to="/signup">Sign Up</NavLink>{" "}
            </p>
          </form>
        </div>
        {/* </div> */}
        <ToastContainer />
      </section>
    </>
  );
};

export default Login;
