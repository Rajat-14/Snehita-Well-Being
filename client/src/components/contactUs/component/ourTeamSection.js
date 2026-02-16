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

          // Filter for Dean, Faculty Advisor, and Counsellors
          const targetTypes = ['dean', 'faculty_advisor', 'counsellor'];
          const filteredMembers = data.filter(member =>
            member.isActive && targetTypes.includes(member.type)
          );

          // Sort order: Dean -> Faculty Advisor -> Counsellor
          const typeOrder = { 'dean': 1, 'faculty_advisor': 2, 'counsellor': 3 };
          filteredMembers.sort((a, b) => {
            const typeScoreA = typeOrder[a.type] || 99;
            const typeScoreB = typeOrder[b.type] || 99;
            if (typeScoreA !== typeScoreB) return typeScoreA - typeScoreB;
            return (a.order || 0) - (b.order || 0);
          });

          setTeamMembers(filteredMembers);
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;

    const baseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/$/, "");
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${baseUrl}${cleanPath}`;
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
                    pic={getImageUrl(profile.image)}
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