import FacultyCard from "./components/facultyCard";
import { useEffect, useState } from "react";

const Counsellors = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/team-members/type/counsellor`);
        if (!response.ok) {
          throw new Error('Failed to fetch counsellors');
        }
        const data = await response.json();
        setCounsellors(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching counsellors:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCounsellors();
  }, []);

  if (loading) {
    return <div><p>Loading Counsellors...</p></div>;
  }

  if (error) {
    return <div className="text-danger"><p>Error: {error}</p></div>;
  }

  return (
    <div>
      {counsellors.map((item, index) => {
        return (
          <div className="my-4" key={index}>
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

export default Counsellors;