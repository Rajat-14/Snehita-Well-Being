import './teamCard.css';
import { FaLocationDot } from "react-icons/fa6";
import { CiLinkedin } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlinePhoneInTalk } from "react-icons/md";
const TeamCard = (props) => {
  return (
    <div className='py-3' data-aos="fade-up" >
      <div className="outer-div mx-2 ">
        <div className="inner-div mx-2">
          <div className="front">
            <div className="front__bkg-photo"></div>
            <div className="front__face-photo">
              <img src={props.pic ? props.pic : ""} alt={"Buddy Pic"} />
            </div>
            <div className="front__text">
              <h3 className="front__text-header">{props.name ? props.name : "Name"}</h3>
              <p className="front__text-para">
                {props.designation ? props.designation : "Designation"}
              </p>
            </div>
          </div>
          <div className="back">
            <div className="social-media-wrapper">
              {props.phoneNo && <a href={`https://wa.me/${props.phoneNo}`} target='_blank' className="social-icon">
                <FaWhatsapp />
              </a>}
              {props.emailId && <a href={"mailto:" + props.emailId} target='_blank' className="social-icon">
                <MdOutlineMailOutline />
              </a>}
              {props.telephoneNo && <a href={"callto:" + props.telephoneNo} target='_blank' className="social-icon">
                <MdOutlinePhoneInTalk />
              </a>}
              {props.instaId && <a href={props.instaId} target='_blank' className="social-icon">
                <FaInstagram />
              </a>}
              {props.linkedinId && <a href={props.linkedinId} target='_blank' className="social-icon">
                <CiLinkedin />
              </a>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TeamCard;
