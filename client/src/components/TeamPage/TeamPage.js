import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import "./TeamPage.css";
import LoadingPage from "../templates/loadingPage";
import Dean from "./dean";

const SnehitaBuddies = React.lazy(() => import("./snehitaBuddies"));
const FA = React.lazy(() => import("./FA"));
const Counsellors = React.lazy(() => import("./counsellors"));
const Animation = React.lazy(() => import("../templates/animation"));

const TeamPage = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <section className="py-5" data-aos="fade-up">
        <div className="container">
          <div className="row page-heading">
            <div className="col-12 text-center">
              <p className="page-head">OUR TEAM</p>
            </div>
          </div>
          <p className="lead" style={{ color: "black" }}>
            Meet our dedicated team committed to fostering mental health and
            well-being at IIT Ropar. From seasoned counselors providing
            compassionate support to esteemed faculty advisors offering
            guidance, and our vibrant Snehita buddies extending a helping hand,
            our team stands united in creating a nurturing environment for every
            member of our campus community
          </p>
        </div>

        <br />
        <br />
        <div>
          <Animation bottom="-70vh" />
        </div>
        <div className="container">
          <div className="mb-3" data-aos="fade-up">
            <div className="page-sticky-head-holder">
              <div className="page-sticky-head fs-5 ">DEAN STUDENT AFFAIRS</div>
            </div>
            {/* Counsellors Section */}
            <Dean />
          </div>
        </div>
        <div className="container">
          <div className="mb-3" data-aos="fade-up">
            <div className="page-sticky-head-holder">
              <div className="page-sticky-head fs-5 ">FACULTY ADVISOR</div>
            </div>
            {/* Counsellors Section */}
            <FA />
          </div>
        </div>
        <div className="container">
          <div className="mb-3" data-aos="fade-up">
            <div className="page-sticky-head-holder">
              <div className="page-sticky-head fs-5 ">COUNSELLOR</div>
            </div>
            {/* Counsellors Section */}
            <Counsellors />
          </div>

          <div className="page-sticky-head-holder">
            <div className="page-sticky-head fs-5">SNEHITA BUDDIES</div>
          </div>
        </div>
        <div className="container" data-aos="fade-up">
          <SnehitaBuddies />
        </div>
      </section>
    </Suspense>
  );
};

export default TeamPage;
