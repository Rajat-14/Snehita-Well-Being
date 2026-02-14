import React from "react";
import "./KnowYourself.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faHouse,
  faNotesMedical,
} from "@fortawesome/free-solid-svg-icons";
import Animation from "../templates/animation";

// import successStoryImage from '../assets/success-story.jpg';

function KnowYourself() {
  return (
    <div className="landing-page">
      <header>
        <div className="section__container header__container">
          <div className="header__content">
            <h1>Know Your Self</h1>
            <p>
              At IIT Ropar, you're embarking on a journey of immense academic
              growth and personal discovery. While chasing your goals is
              exciting, it's crucial to prioritize your mental health for
              sustained success and overall well-being. This page offers
              valuable insights and resources to help your strike that perfect
              balance.
            </p>
            <NavLink to = '/blogs'>
            <button className="btn2">See Our Blogs</button>
            </NavLink>
          </div>
        </div>
      </header>
      <Animation bottom="-40vh"/>
      <section className="section__container service__container">
        <div className="service__header">
          <div className="service__header__content">
            <h2 className="section__header">Self-Assessment Tools</h2>
            <p>
              Understanding your mental health is an essential step towards
              well-being. Our self-assessment tools are designed to help you
              gain insights into your emotional state, coping mechanisms, and
              overall mental wellness
            </p>
          </div>
          <NavLink to = '/FunQuizzes'>

          <button className="service__btn">Take Test</button>
          </NavLink>
        </div>
        <div className="service__grid">
          <div className="service__card">
            <span>
              <FontAwesomeIcon icon={faBrain} />
            </span>
            <h4>Cultivate a Positive Mindset</h4>
            <p>
              Embrace Self-compassion and gratitude. Reframe challenges as
              oppertunities for growth. Develop a growth mindset for resilence.
            </p>
            <a href="#">Learn More</a>
          </div>
          <div className="service__card">
            <span>
              <FontAwesomeIcon icon={faNotesMedical} />
            </span>
            <h4>Build Healthy Habits</h4>
            <p>
              Regular exercise: Boost mood and reduce stress.&nbsp; Balance
              diet: Prioritize fruits, vegetables, whole grains.&nbsp; Quality
              sleep: Essential for cognitive function and well-being.&nbsp;
              Mindfulness and Relaxation techniques: Manage stress and improve
              focus.
            </p>
            <a href="#">Learn More</a>
          </div>
          <div className="service__card">
            <span>
              <FontAwesomeIcon icon={faHouse} />
            </span>
            <h4>Develop Resilence</h4>
            <p>
              Stress Management: Journaling, talking to friends, seeking help.
              Strong Support Networks: Connect with friends, family, mentors.
              Seek profesional help: Normalize and encourage consuitation.
            </p>
            <a href="#">Learn More</a>
          </div>
        </div>
      </section>

      <div className="appn_main my-3">
        <NavLink to = '/appointment'>

        <button className="appn">Take Appointment</button>
        </NavLink>
      </div>
    </div>
  );
}

export default KnowYourself;
