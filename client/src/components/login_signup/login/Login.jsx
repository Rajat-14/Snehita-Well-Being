import React, { useState, useEffect } from "react";
import "../../login_signup/login_signup.css";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../../services/helper";
import axios from "axios";

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async (event) => {
    event?.preventDefault();
    if (!email) {
      toast.error("Email is required!");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${BASE_URL}/user/sendloginotp`, { email }, {
        withCredentials: true,
      });
      toast.success("OTP sent to your email.");
      setStep(2);
      setTimer(30);
      setCanResend(false);
    } catch (error) {
      console.error("Send OTP Error:", error);
      toast.error(error.response?.data?.message || error.response?.data?.error || "Failed to send OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const login = async (event) => {
    event.preventDefault();
    if (!otp) {
      toast.error("OTP is required!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, { email, otp }, {
        withCredentials: true,
      });
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Login successful");

      setTimeout(() => {
        if (response.data.user.role === 'admin') {
            window.location.href = "/admin/dashboard";
        } else {
            window.location.href = "/";
        }
      }, 1500);
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section>
        <div className="form_group">
          <div className="header_form">
            <h1>Login</h1>
            <p>Welcome to the login page</p>
          </div>
          <form>
            <div className="enter_in_form">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={step === 2}
              />
            </div>
            {step === 2 && (
              <div className="enter_in_form">
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP sent to your email"
                />
              </div>
            )}

            {step === 1 ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSendOtp}
                className="btn"
              >
                {isSubmitting && <div className="spinner"></div>}
                {isSubmitting ? "Sending OTP..." : "Next"}
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={login}
                  className="btn"
                >
                  {isSubmitting && <div className="spinner"></div>}
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.9rem' }}>
                    Didn't receive code?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={!canResend || isSubmitting}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: canResend ? '#20b3f7' : '#aaa',
                      cursor: canResend ? 'pointer' : 'default',
                      textDecoration: canResend ? 'underline' : 'none',
                      padding: 0,
                      fontSize: '0.9rem'
                    }}
                  >
                    Resend {timer > 0 ? `(${timer}s)` : ""}
                  </button>
                </div>
              </>
            )}

            <p className="txt" style={{ marginTop: '15px' }}>
              Don't have an account? <NavLink to="/signup">Sign Up</NavLink>
            </p>
          </form>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default Login;
