import React, { useState } from "react";
import "../../login_signup/login_signup.css";
import { NavLink, redirect, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
// import { sentOtpFunction } from "../services/Apis";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../../services/helper";
import axios from "axios";

const Email = (props) => {
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chk = location.state ? location.state.chk : null;
  const navigate = useNavigate();
  let [input, setinput] = useState({
    email: "",
  });
  let fnct2 = (event) => {
    let { name, value } = event.target;
    setinput({ ...input, [name]: value });
  };

  const login = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (!input.email) {
      toast.error("All fields are required!");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/user/sendotppassword`, input, {
        withCredentials: true,
      });
      toast.success("OTP Sent");

      setTimeout(() => {
        navigate("/otpforget", { state: input });
      }, 1000);
      setIsSubmitting(false);
    } catch (error) {
      toast.error("Login failed. Please try again.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false); // Stop form submission
    }
  };

  return (
    <>
      <section>
        <div className="form_group">
          <div className="header_form">
            <h1>Forgot Password</h1>
            <p>Enter your email & we'll send you a otp for verification.</p>
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
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={login}
              className="btn"
            >
              {isSubmitting && <div className="spinner"></div>}
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </div>
        {/* </div> */}
        <ToastContainer />
      </section>
    </>
  );
};

export default Email;
