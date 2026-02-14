import React from "react";
import "./aboutUs2.css";
import { TbTargetArrow } from "react-icons/tb";
import { FaEnvelope } from "react-icons/fa";
import { RiMentalHealthFill } from "react-icons/ri";
import { MdPeopleAlt } from "react-icons/md";
import { BiSolidMessageAltDetail } from "react-icons/bi";
import { BiSolidMessageAltAdd } from "react-icons/bi";
import Animation from "../templates/animation";
import FacultyAdvisorMessage from "./sections/facultyAdvisorMessage";
import CounsellorMessage from "./sections/cousellorsMessage";
import AboutSnehita from "./sections/aboutSnehita";
import DeanMessage from "./sections/deanMessage";
import DirectorMessage from "./sections/directorMessage";
const AboutUs2Page = () => {
  return (
    <section className="py-5" data-aos="zoom-in">
      <div className="container">
        <div className="row page-heading">
          <p className="page-head">ABOUT US</p>
        </div>
        <div className="row">
          <div className="nav-bar-back px-0">
            <ul
              className="nav nav-pills mb-3 mx-1 justify-content-center"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active aboutUsFilter"
                  id="pills-snehita-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-snehita"
                  type="button"
                  role="tab"
                  aria-controls="pills-snehita"
                  aria-selected="true"
                >
                  <div className="postion-relative justify-content-center ">
                    <RiMentalHealthFill size={35} />
                    {/* <MdPeopleAlt size={40} /> */}
                  </div>
                  SNEHITA
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link aboutUsFilter"
                  id="pills-director-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-director"
                  type="button"
                  role="tab"
                  aria-controls="pills-director"
                  aria-selected="false"
                >
                  <div className="d-flex flex-column  position-relative ">
                    <div className="postion-relative justify-content-center ">
                      <BiSolidMessageAltDetail size={35} />
                    </div>
                    DIRECTOR'S MESSAGE
                  </div>
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link aboutUsFilter"
                  id="pills-dean-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-dean"
                  type="button"
                  role="tab"
                  aria-controls="pills-dean"
                  aria-selected="false"
                >
                  <div className="d-flex flex-column  position-relative ">
                    <div className="postion-relative justify-content-center ">
                      <BiSolidMessageAltDetail size={35} />
                    </div>
                    DEAN'S MESSAGE
                  </div>
                </button>
              </li>
              <li className="nav-item " role="presentation">
                <button
                  className="nav-link aboutUsFilter "
                  id="pills-fa-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-fa"
                  type="button"
                  role="tab"
                  aria-controls="pills-fa"
                  aria-selected="false"
                >
                  <div className="d-flex flex-column position-relative ">
                    <div className="postion-relative justify-content-center ">
                      <FaEnvelope size={35} />
                    </div>
                  </div>
                  FACULTY ADVISORS'S MESSAGE
                </button>
              </li>

              <li className="nav-item" role="presentation">
                <button
                  className="nav-link aboutUsFilter"
                  id="pills-counsellor-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-counsellor"
                  type="button"
                  role="tab"
                  aria-controls="pills-counsellor"
                  aria-selected="false"
                >
                  <div className="d-flex flex-column  position-relative ">
                    <div className="postion-relative justify-content-center ">
                      <BiSolidMessageAltAdd size={35} />
                    </div>
                    COUNSELLOR'S MESSAGE
                  </div>
                </button>
              </li>
            </ul>
          </div>

          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-snehita"
              role="tabpanel"
              aria-labelledby="pills-snehita-tab"
              tabIndex="0"
            >
              <div className="col-12 text-start  ">
                <div className="lead text-black ">
                  <AboutSnehita />
                </div>
              </div>
            </div>

            <div
              className="tab-pane fade"
              id="pills-director"
              role="tabpanel"
              aria-labelledby="pills-director-tab"
              tabIndex="0"
            >
              <div className="col-12 text-start  ">
                <div className="lead text-black ">
                  <DirectorMessage />
                </div>
              </div>
            </div>
            
            <div
              className="tab-pane fade"
              id="pills-dean"
              role="tabpanel"
              aria-labelledby="pills-dean-tab"
              tabIndex="0"
            >
              <div className="col-12 text-start  ">
                <div className="lead text-black ">
                  <DeanMessage />
                </div>
              </div>
            </div>

            <div
              className="tab-pane fade"
              id="pills-fa"
              role="tabpanel"
              aria-labelledby="pills-fa-tab"
              tabIndex="0"
            >
              <div className="lead text-black ">
                <FacultyAdvisorMessage />
              </div>
            </div>

            <div
              className="tab-pane fade"
              id="pills-counsellor"
              role="tabpanel"
              aria-labelledby="pills-counsellor-tab"
              tabIndex="0"
            >
              <div className="lead text-black ">
                <CounsellorMessage />
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-disabled"
              role="tabpanel"
              aria-labelledby="pills-disabled-tab"
              tabIndex="0"
            >
              ...
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs2Page;
