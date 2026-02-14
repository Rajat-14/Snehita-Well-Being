import React, { useState } from "react";
import "../../login_signup/login_signup.css";
import { NavLink, redirect, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
// import { sentOtpFunction } from "../services/Apis";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../../services/helper";
import axios from "axios";

const NewPassword = (props) => {
  // let time = props.chk.date.toLocaleString('en-US',{month:'long'})
  // let year = props.chk.date.getFullYear()
  let email = localStorage.getItem("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const chk = location.state ? location.state.chk : null;

  const navigate = useNavigate();
  let [input, setinput] = useState({
    password: "",
    confirm_password: "",
  });
  let fnct2 = (event) => {
    let { name, value } = event.target;
    setinput({ ...input, [name]: value });
  };

  const reset = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (!input.password || !input.confirm_password) {
      setIsSubmitting(false);
      toast.error("All fields are required!");
      return;
    }

    if (input.password !== input.confirm_password) {
      toast.error("Passwords must match!");
    } else {
      const data = {
        email,
        password: input.password,
      };
      try {
        await axios.post(`${BASE_URL}/user/newpassword`, data, {
          withCredentials: true,
        });
        toast.success("Password Reset Succesfully");
        setTimeout(() => {
          navigate("/login"); // Redirect to home page
        }, 1500);
        setIsSubmitting(false);
      } catch (error) {
        toast.error("Password Reset Failed. Please try again.");
        setIsSubmitting(false);
      }finally {
        setIsSubmitting(false); // Stop form submission
      }
    }
  };

  return (
    <>
      <section>
        <div className="form_group">
          <div className="header_form">
            <h1>Reset Password</h1>
            {/* <p>welcome to login page</p> */}
          </div>
          <form>
            <div className="enter_in_form">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                onChange={fnct2}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="enter_in_form">
              <label htmlFor="confirm_password">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                onChange={fnct2}
                placeholder="Enter your password again"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={reset}
              className="btn"
            >
                {isSubmitting && <div className="spinner"></div>}
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
        {/* </div> */}
        <ToastContainer />
      </section>
    </>
  );
};

export default NewPassword;
