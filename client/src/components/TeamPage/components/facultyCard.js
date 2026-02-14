import TeamCard from "./teamCard";
const FacultyCard=(props)=>{
  console.log(props);
    return (<div className="container" data-aos="fade-up" >
    <div className="row mb-5 ">
      <div className="col-md-12 col-lg-3 col-12 mx-md-5 mx-lg-0 align-self-center">
        <TeamCard pic={props.pic} name={props.name} designation={props.designation} emailId={props.emailId} telephoneNo={props.telephoneNo} />
      </div>
      <div className="col-lg-1"></div>
      <div className="col-md-12 col-lg-7 desc_text align-self-center fs-4  ">
        {props.experience}
      </div>
    </div>
  </div>);
}
export default FacultyCard;