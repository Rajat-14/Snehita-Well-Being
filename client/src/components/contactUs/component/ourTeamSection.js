import TeamCard from "../../TeamPage/components/teamCard";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const OurTeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/team-members`);
        if (response.ok) {
          const data = await response.json();
          // Filter for only specific roles if needed, or sort by order
          // For now, take the first 3 or relevant ones to display on contact page
          // Strategy: Display counsellors or mix, limiting to 3 for the preview
          const activeMembers = data.filter(member => member.isActive);
          // Sort if order is available
          activeMembers.sort((a, b) => (a.order || 0) - (b.order || 0));

          setTeamMembers(activeMembers.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleNavLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className=" my-4  container " data-aos="fade-up">
      <p className="d-flex justify-content-center border-bottom fs-1" style={{ marginTop: "40px", color: "black" }}>
        OUR TEAM
      </p>

      <div className="container mt-5">
        <div className="row">
          {loading ? (
            <div className="d-flex justify-content-center w-100">
              <p>Loading team...</p>
            </div>
          ) : (
            teamMembers.map((profile) => {
              return (
                <div className="col-lg-6 col-xl-4 mb-3 " key={profile.id || profile.name}>
                  <TeamCard
                    name={profile.name}
                    designation={profile.designation} // Using designation as backend doesn't seem to have fullDesignation populated in seed for everyone, or I should use designation
                    emailId={profile.email}
                    pic={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${profile.image}`}
                    telephoneNo={profile.telephoneNo}
                  />
                </div>
              )
            }
            )
          )}
        </div>
      </div>

      {/* Button to Direct to Another Page */}
      <div className="row" style={{ marginTop: "30px" }}>
        <div className="col-12 text-center">
          <NavLink className="btn btn-outline-dark " to="/TeamPage" role="button" onClick={handleNavLinkClick}>
            View Full Team
          </NavLink>
        </div>
      </div>
    </div>
  );
}
export default OurTeamSection;