const ProfileCard = ({ name, email, position, image }) => {
    return (
      <div className="profile-card">
        <img  alt="Profile" className="rounded-circle" />
        <div className="profile-info">
          <h5 className="card-title">{name}</h5>
          <p>{position}</p>
          <a href={`mailto:${email}`} className="card-link">{email}</a>
        </div>
      </div>
    );
  };
  export default ProfileCard;