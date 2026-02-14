import {
    FaInstagram,
    FaFacebook,
    FaLinkedin,
    FaTwitter,
    FaYoutube
} from "react-icons/fa";
import { useEffect, useState } from "react";
import './socialMedia.css';

const SocialMedia = () => {
    const [socialMediaData, setSocialMediaData] = useState([]);

    useEffect(() => {
        const fetchSocialMedia = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/organization-info/type/social_media`);
                if (response.ok) {
                    const data = await response.json();
                    setSocialMediaData(data);
                }
            } catch (error) {
                console.error("Error fetching social media links:", error);
            }
        };
        fetchSocialMedia();
    }, []);

    const getIcon = (title) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes("instagram")) return <FaInstagram />;
        if (lowerTitle.includes("facebook")) return <FaFacebook />;
        if (lowerTitle.includes("linkedin")) return <FaLinkedin />;
        if (lowerTitle.includes("twitter")) return <FaTwitter />;
        if (lowerTitle.includes("youtube")) return <FaYoutube />;
        return null;
    };

    if (socialMediaData.length === 0) return null;

    return (
        <div className="container d-flex flex-row justify-content-center px-5 p-3 pb-5 ">
            {socialMediaData.map((item) => {
                const icon = getIcon(item.title);
                if (!icon) return null;

                return (
                    <div className="mx-5 fs-1 socialMedia" key={item.id}>
                        <a href={item.description} target="_blank" rel="noopener noreferrer">{icon}</a>
                    </div>
                );
            })}
        </div>
    );
}
export default SocialMedia;