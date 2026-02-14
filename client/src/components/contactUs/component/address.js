import map2 from "../assets/map_2.png";
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";

const Address = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/contact-details`);
        if (!response.ok) {
          throw new Error('Failed to fetch contact details');
        }
        const data = await response.json();
        if (data.length > 0) {
          setContact(data[0]);
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching contact details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContactDetails();
  }, []);

  if (loading) {
    return <div className="container mt-5"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger"><p>Error: {error}</p></div>;
  }

  if (!contact) {
    return <div className="container mt-5"><p>No contact information available</p></div>;
  }

  return (
    <div className="container mt-5" data-aos="zoom-in">
      <div className="row h-100 ">
        <div className="col-md-6">
          <a
            href={contact.mapsLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
          >
            <div className="overlay"></div>
          </a>
        </div>
        <div className="col-md-6 py-auto">
          <div className="row">
            <div className="col ">
              <div className=" fs-1 d-flex justify-content-center my-2 border-bottom">
                <div className="fs-2 p-1">
                  <FaHome />
                </div>
                Address
              </div>
              <div className="d-flex justify-content-center w-25 "></div>
              <div className=" fs-4 d-flex justify-content-center my-1">
                {contact.location}
              </div>
              <div className=" fs-6 d-flex justify-content-center">
                {contact.addressLine1}
              </div>
              {contact.addressLine2 && (
                <div className=" fs-6 d-flex justify-content-center">
                  {contact.addressLine2}
                </div>
              )}
              {contact.addressLine3 && (
                <div className=" fs-6 d-flex justify-content-center">
                  {contact.addressLine3}
                </div>
              )}
              <div className=" fs-6 d-flex justify-content-center">
                {contact.city}, {contact.state}
              </div>
              <div className=" fs-6 d-flex justify-content-center">
                {contact.country} {contact.postalCode}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Address;
