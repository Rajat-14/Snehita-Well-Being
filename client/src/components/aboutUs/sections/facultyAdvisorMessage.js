
import MessageCard from "../component/messageCard";
import { useEffect, useState } from "react";

const FacultyAdvisorMessage = () => {
  const [facultyAdvisors, setFacultyAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacultyAdvisors = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/team-members/type/faculty_advisor`);
        if (response.ok) {
          const data = await response.json();
          setFacultyAdvisors(data);
        }
      } catch (error) {
        console.error("Error fetching faculty advisors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyAdvisors();
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><p>Loading messages...</p></div>;
  }

  return (
    <div>
      {facultyAdvisors.map((item, index) => {
        return (
          <div className="mt-2" key={item.id || index}>
            <MessageCard
              pic={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${item.image}`}
              name={item.name}
              designation={item.designation} // Using designation from DB.
              emailId={item.email}
              telephoneNo={item.telephoneNo}
              message={item.message}
            />
            <hr></hr>
          </div>
        );
      })}
    </div>
  );
};
export default FacultyAdvisorMessage;
