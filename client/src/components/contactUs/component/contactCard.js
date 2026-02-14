import { NavLink } from "react-router-dom";
import "./contactCard.css";
const ContactCard = (props) => {
  return (
    <NavLink
      to={props.link}
      className="d-flex flex-column justify-content-evenly contactCard mx-2 my-2 text-decoration-none  "
      style={{ backgroundColor: props.backgroundColor, cursor: "pointer", color:"black" }}
      onMouseEnter={(e) => e.currentTarget.classList.add("hover")}
      onMouseLeave={(e) => e.currentTarget.classList.remove("hover")}
      data-aos="fade-up"
    >
      <div className="p-2 d-flex justify-content-center contact-mode-icon">{props.icon}</div>
      <div className="d-flex justify-content-center text-center text-wrap p-2 contact-mode-name">
        {props.contactMode}
      </div>
    </NavLink>
  );
};
export default ContactCard;
