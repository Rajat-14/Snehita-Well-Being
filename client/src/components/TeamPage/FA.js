import FacultyCard from "./components/facultyCard";
import { useEffect, useState } from "react";

const FA = () => {
  const [facultyAdvisors, setFacultyAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacultyAdvisors = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/team-members/type/faculty_advisor`);
        if (!response.ok) {
          throw new Error('Failed to fetch faculty advisors');
        }
        const data = await response.json();
        setFacultyAdvisors(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching faculty advisors:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyAdvisors();
  }, []);

  if (loading) {
    return <div><p>Loading Faculty Advisors...</p></div>;
  }

  if (error) {
    return <div className="text-danger"><p>Error: {error}</p></div>;
  }

  return (
    <div>
      {facultyAdvisors.map((item, index) => {
        return (
          <div className="my-2" key={index}>
            <FacultyCard
              pic={`http://localhost:8000${item.image || ''}`}
              name={item.name}
              designation={item.designation}
              emailId={item.email}
              experience={item.experience}
              telephoneNo={item.telephoneNo}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FA;
