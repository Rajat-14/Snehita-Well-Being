import MessageCard from "../component/messageCard";
import { useEffect, useState } from "react";

const DeanMessage = () => {
  const [messageData, setMessageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeanMessage = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/messages/type/dean`);
        if (!response.ok) {
          throw new Error('Failed to fetch dean message');
        }
        const data = await response.json();
        if (data.length > 0) {
          setMessageData(data[0]);
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching dean message:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeanMessage();
  }, []);

  if (loading) {
    return <div className="mt-2"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="mt-2 text-danger"><p>Error: {error}</p></div>;
  }

  if (!messageData) {
    return <div className="mt-2"><p>No message available</p></div>;
  }

  // Handle message being an array (from JSON/seed) or string (fallback)
  let messageArray = [];
  if (Array.isArray(messageData.message)) {
    messageArray = messageData.message;
  } else if (typeof messageData.message === 'string') {
    try {
      // Try parsing in case it's a JSON string
      const parsed = JSON.parse(messageData.message);
      if (Array.isArray(parsed)) messageArray = parsed;
      else messageArray = messageData.message.split('\n').filter(line => line.trim());
    } catch (e) {
      messageArray = messageData.message.split('\n').filter(line => line.trim());
    }
  }

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Fix image path
  const imagePath = messageData.image
    ? (messageData.image.startsWith('http') ? messageData.image : `${apiUrl}${messageData.image}`)
    : null;

  return (
    <div className="mt-2">
      <MessageCard
        pic={imagePath}
        name={messageData.name}
        designation={messageData.designation}
        emailId={messageData.email} // Changed from emailId
        telephoneNo={messageData.telephoneNo}
        message={messageArray}
      />
      <hr></hr>
    </div>
  );
};
export default DeanMessage;
