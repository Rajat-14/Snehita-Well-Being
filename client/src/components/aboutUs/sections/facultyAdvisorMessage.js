
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
        // Handle message being an array (from JSON/seed if not stringified?) or string (stored JSON)
        let messageArray = [];
        if (Array.isArray(item.message)) {
          messageArray = item.message;
        } else if (typeof item.message === 'string') {
          try {
            const parsed = JSON.parse(item.message);
            if (Array.isArray(parsed)) messageArray = parsed;
            else messageArray = item.message.split('\n').filter(line => line.trim());
          } catch (e) {
            messageArray = item.message.split('\n').filter(line => line.trim());
          }
        }
        // If null/undefined, messageArray remains [] which is safe for MessageCard

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        // Fix image path logic
        const imagePath = item.image
          ? (item.image.startsWith('http') ? item.image : `${apiUrl}${item.image}`)
          : null;

        return (
          <div className="mt-2" key={item.id || index}>
            <MessageCard
              pic={imagePath}
              name={item.name}
              designation={item.designation}
              emailId={item.email}
              telephoneNo={item.telephoneNo}
              message={messageArray}
            />
            <hr></hr>
          </div>
        );
      })}
    </div>
  );
};
export default FacultyAdvisorMessage;
