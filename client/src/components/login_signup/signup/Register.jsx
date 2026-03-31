import React, { useState, useRef } from "react";
import "../../login_signup/login_signup.css";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../services/helper";
import ImageCropperModal from "../../common/ImageCropperModal";

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null); // displayed thumbnail
  const [croppedDataUrl, setCroppedDataUrl] = useState(null); // base64 ready to upload
  const [rawImageSrc, setRawImageSrc] = useState(null);       // src for the cropper
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef();

  let [input, setinput] = useState({
    person_name: "",
    email: "",
    mobileNumber: "",
    entryNumber: "",
    gender: "",
  });

  let fnct2 = (event) => {
    let { name, value } = event.target;
    setinput({ ...input, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Photo must be under 10MB.");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setRawImageSrc(objectUrl);
    setShowCropper(true);
    // Reset the file input so same file can be re-selected
    e.target.value = "";
  };

  const handleCropComplete = (dataUrl) => {
    setCroppedDataUrl(dataUrl);
    setProfilePreview(dataUrl);
    setShowCropper(false);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setRawImageSrc(null);
  };

  const Regist = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (!input.person_name || !input.email || !input.mobileNumber || !input.gender) {
      setIsSubmitting(false);
      toast.error("All fields are required!");
      return;
    }

    const emailRegex = /^[^!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+@iitrpr\.ac\.in$/i;
    if (!emailRegex.test(input.email)) {
      setIsSubmitting(false);
      toast.error("Enter a valid IIT Ropar email!");
      return;
    }

    try {
      console.log("input", input);
      await axios.post(`${BASE_URL}/user/sendotp`, input, { withCredentials: true });
      // Pass the cropped base64 through route state to the OTP page
      navigate("/otp", { state: { ...input, croppedDataUrl } });
    } catch (error) {
      setIsSubmitting(false);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showCropper && rawImageSrc && (
        <ImageCropperModal
          imageSrc={rawImageSrc}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      <section>
        <div className="form_group">
          <div className="header_form">
            <h1>Sign Up</h1>
            <p>Create an account to explore all our exciting features.</p>
          </div>
          <form>
            {/* Profile Photo Upload */}
            <div className="enter_in_form" style={{ textAlign: "center", marginBottom: "16px" }}>
              <div
                onClick={() => fileInputRef.current.click()}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  border: "2px dashed #03a9f4",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  overflow: "hidden",
                  backgroundColor: "#f0f0f0",
                  position: "relative",
                }}
                title="Click to upload profile photo"
              >
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: "12px", color: "#888", padding: "8px", textAlign: "center" }}>
                    📷 Upload Photo
                  </span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
              <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                {profilePreview ? "Click to change" : "Optional (Max 10MB)"}
              </div>
            </div>

            <div className="enter_in_form">
              <label htmlFor="person_name">Name</label>
              <input type="text" name="person_name" onChange={fnct2} placeholder="Enter your full name" required />
            </div>
            <div className="enter_in_form">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" onChange={fnct2} placeholder="Enter your email" required />
            </div>
            <div className="enter_in_form">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <input type="text" name="mobileNumber" onChange={fnct2} placeholder="Enter your mobile number" required />
            </div>
            <div className="enter_in_form">
              <label htmlFor="entryNumber">Entry Number</label>
              <input type="text" name="entryNumber" onChange={fnct2} placeholder="Enter your entry number" required />
            </div>
            <div className="enter_in_form">
              <label htmlFor="gender">Gender</label>
              <select
                name="gender"
                onChange={fnct2}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button type="submit" disabled={isSubmitting} onClick={Regist} className="btn">
              {isSubmitting && <div className="spinner"></div>}
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <p className="txt">
              {" "}Already I have account <NavLink to="/login">Login</NavLink>{" "}
            </p>
          </form>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default Register;
