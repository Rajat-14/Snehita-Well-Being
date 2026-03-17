import React, { useState } from "react";
import "../../login_signup/login_signup.css";
import { NavLink, useNavigate } from "react-router-dom";
// import { registerfunction } from '../services/Apis';
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../services/helper";
// import {registerfunction} from '../services/Apis'

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  let [input, setinput] = useState({
    person_name: "",
    email: "",
    mobileNumber: "",
    gender: "",
  });
  let fnct2 = (event) => {
    let { name, value } = event.target;
    setinput({ ...input, [name]: value });
  };
  // console.log(input)
  const Regist = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (
      !input.person_name ||
      !input.email ||
      !input.mobileNumber ||
      !input.gender
    ) {
      setIsSubmitting(false);
      toast.error("All fields are required!");
      return;
    }

    const emailRegex = /^[^!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+@iitrpr\.ac\.in$/i;
    const isValid = emailRegex.test(input.email);

    if (!isValid) {
      setIsSubmitting(false);
      toast.error("Enter a valid IIT Ropar email!");
    } else {
      try {
        console.log("input", input);
        const response = await axios.post(`${BASE_URL}/user/sendotp`, input, {
          withCredentials: true,
        });
        navigate("/otp", { state: input });
        // toast.success("Registration successful");
      } catch (error) {
        setIsSubmitting(false);
        const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed. Please try again.";
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false); // Stop form submission
      }
    }
  };

  return (
    <>
      <section>
        <div className="form_group">
          <div className="header_form">
            <h1>Sign Up</h1>
            <p>Create an account to explore all our exciting features.</p>
          </div>
          <form>
            <div className="enter_in_form">
              <label htmlFor="person_name">Name</label>
              <input
                type="text"
                name="person_name"
                onChange={fnct2}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="enter_in_form">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                onChange={fnct2}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="enter_in_form">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                onChange={fnct2}
                placeholder="Enter your mobile number"
                required
              />
            </div>
            <div className="enter_in_form">
              <label htmlFor="gender">Gender</label>
              <select name="gender" onChange={fnct2} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '5px' }}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              onClick={Regist}
              className="btn"
            >
              {isSubmitting && <div className="spinner"></div>}
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <p className="txt">
              {" "}
              Already I have account <NavLink to="/login">Login</NavLink>{" "}
            </p>
          </form>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default Register;
