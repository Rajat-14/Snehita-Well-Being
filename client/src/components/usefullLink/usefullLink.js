import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/helper';
import { MdOutlinePhoneInTalk } from "react-icons/md";
import './usefullLink.css';

const UsefullLink = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/useful-links`);
                setLinks(res.data);
            } catch (error) {
                console.error("Failed to fetch useful links", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLinks();
    }, []);

    if (loading) {
        return <div className="d-flex justify-content-center my-5">Loading links...</div>;
    }

    const imageLinks = links.filter(l => l.type === 'link');
    const phoneLinks = links.filter(l => l.type === 'phone');

    return (
        <div className="d-flex flex-column flex-1 container my-3" data-aos="fade-up">
            
            {/* Render image links */}
            <div className="useful-links-grid">
            {imageLinks.map((link, idx) => (
                <div key={link.id || idx} className='useful-link-card' data-aos="fade-up">
                    <a href={link.url || '#'} target="_blank" rel="noopener noreferrer" className='useful-link-anchor'>
                        {link.pic ? (
                            <img
                                src={link.pic.startsWith('http') ? link.pic : `${BASE_URL}/uploads/useful-links/${link.pic}`}
                                alt={link.title}
                                loading="lazy"
                                className="useful-link-img"
                            />
                        ) : (
                            <div className="useful-link-placeholder">
                                <span>{link.title}</span>
                            </div>
                        )}
                        {link.title && link.pic && (
                            <div className="useful-link-title">{link.title}</div>
                        )}
                    </a>
                </div>
            ))}
            </div>

            {/* Render phone numbers */}
            {phoneLinks.length > 0 && (
                <div className='d-flex flex-row justify-content-evenly flex-wrap my-4' data-aos="fade-up">
                    {phoneLinks.map((link, idx) => (
                        <div key={link.id || idx} className='d-flex flex-row text-light justify-content-evenly text-decoration-none phoneNo-tele-manas px-2 shadow-lg mb-3 mx-2'>
                            <MdOutlinePhoneInTalk size={25} style={{ marginRight: '10px' }}/>
                            <div className=''>
                            {link.url}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {links.length === 0 && (
                <div className="text-center my-5">
                    <p>No useful links available.</p>
                </div>
            )}

        </div>
    );
}

export default UsefullLink;