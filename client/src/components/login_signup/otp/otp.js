import React, { useState } from "react";
import "../../login_signup/login_signup.css";
import { useLocation } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../services/helper";

const Otp = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otp, setOtp] = useState(0);
  const [counter, setCounter] = useState(30);
  const [otpExpired, setOtpExpired] = useState(false);
  const [fiveMinCounter, setFiveMinCounter] = useState(300);

  const setOtpHandler = (event) => {
    setOtp(event.target.value);
  };
  const otpVerificationHandler = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    if (otp === "") {
      toast.error("please enter otp");
    } else {
      try {
        const data = {
          person_name: location.state.person_name,
          otp,
          email: location.state.email,
          password: location.state.password,
          confirm_password: location.state.confirm_password,
        };
        await axios.post(`${BASE_URL}/user/register`, data, {
          withCredentials: true,
        });

        toast.success("Registration successful");
        setTimeout(() => {
          window.location.href = "/"; // Redirect to home page
        }, 1500);
      } catch (error) {
        toast.error("Failed. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const otpResendHandler = async (e) => {
    e.preventDefault();
    setIsResending(true);
    try {
      await axios.post(`${BASE_URL}/user/sendotp`, location.state, {
        withCredentials: true,
      });
      toast.success("OTP sent successfully");
      setCounter(30);
      setFiveMinCounter(300);
      setOtpExpired(false);
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  React.useEffect(() => {
    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      setOtpExpired(true);
    }
  }, [counter]);

  React.useEffect(() => {
    if (fiveMinCounter > 0) {
      setTimeout(() => setFiveMinCounter(fiveMinCounter - 1), 1000);
    } else {
      setOtpExpired(true);
    }
  }, [fiveMinCounter]);

  return (
    <>
      <section>
        <div className="form_group">
          <div className="header_form">
            <h1>OTP</h1>
            <span>
              {otpExpired ? (
                "Click on 'Resend OTP' to get a new OTP"
              ) : (
                <>
                  OTP sent to your{" "}
                  <span style={{ color: "#20b3f7" }}>
                    {location.state.email}
                  </span>{" "}
                  email
                </>
              )}
            </span>
          </div>
          <form>
            <div className="enter_in_form">
              <label htmlFor="otp">OTP verification</label>
              <input
                type="number"
                name="otp"
                onChange={setOtpHandler}
                placeholder="Enter OTP"
              />
            </div>
            {!otpExpired && (
              <div className="countdown-text">
                <p>Time Remaining: {counter}</p>
              </div>
            )}
            {(otpExpired || fiveMinCounter === 0) && (
              <div
                className="countdown-text"
                onClick={otpResendHandler}
                style={{ cursor: "pointer" }}
              >
                {isResending ? "Resending..." : "Resend OTP"}
                {isResending && <div className="spinner"></div>}
              </div>
            )}
            <button
              className="btn"
              onClick={otpVerificationHandler}
              disabled={otpExpired && fiveMinCounter === 0}
            >
              {isVerifying ? "Verifying..." : "Verify OTP/Registration"}
              {isVerifying && <div className="spinner"></div>}
            </button>
          </form>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default Otp;
