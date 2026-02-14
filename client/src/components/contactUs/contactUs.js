import React, { useState, useEffect } from "react";
import "./contactUs.css";
import ContactCard from "./component/contactCard";
import { BiLogoGmail } from "react-icons/bi";
import { PiChatCenteredTextFill } from "react-icons/pi";
import { RiPagesLine } from "react-icons/ri";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdEmojiPeople } from "react-icons/md";
import SocialMedia from "./component/socialMedia";
import Address from "./component/address";
import OurTeamSection from "./component/ourTeamSection";
import Animation from "../templates/animation";
import { NavLink } from "react-router-dom";
const ContactUs = () => {
  const [email, setEmail] = useState("snehita@iitrpr.ac.in"); // Default fallback

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/contact-details`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0 && data[0].email) {
            setEmail(data[0].email);
          }
        }
      } catch (error) {
        console.error("Error fetching contact details:", error);
      }
    };
    fetchContactDetails();
  }, []);

  return (
    <div className="contactUs">
      <div className="contactUs-heading-section">
        <div className="container d-flex flex-column align-items-center  ">
          <div className="contactUs-heading-section-contactUs">
            CONTACT US
          </div>
          <div className="contactUs-heading-section-tagline">
            Get In Touch
          </div>
          <div className="px-5  contactUs-heading-section-caption text-wrap   ">
            Looking forward to hear from you
          </div>
        </div>
      </div>
      <div className="container d-flex flex-row row-cols-1 row-cols-sm-4  justify-content-center contactMode-section flex-wrap">
        <ContactCard
          icon={<BiLogoGmail />}
          contactMode={"Mail Us"}
          backgroundColor={"rgb(205,204,248)"}
          link={`mailto:${email}`}
        />
        <ContactCard
          icon={<MdEmojiPeople />}
          contactMode={"Meet Our Team"}
          backgroundColor={"rgb(248, 238, 204)"}
          link={'/TeamPage'}
        />
        <ContactCard
          icon={<RiPagesLine />}
          contactMode={"Appointment"}
          backgroundColor={"rgb(169,229,178)"}
          link={'/appointment'}
        />
      </div>

      <Animation />
      <Address />
      <OurTeamSection />
      {/* <div className="container">
        <div className="d-flex justify-content-center fs-2 border-bottom mt-5 w-100 ">
          Social Media
        </div>
        <SocialMedia />
      </div>  */}
    </div>
  );
};
export default ContactUs;
