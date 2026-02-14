import TeleMANAS from '../assets/UsefullLinks/TeleMANAS.png';
import ManoDarpan from '../assets/UsefullLinks/manodarpan.jpg';
import NIMHR from '../assets/UsefullLinks/nimhr.png';
import { MdOutlinePhoneInTalk } from "react-icons/md";
import './usefullLink.css';
const UsefullLink=()=>{
    return (
        <div className="d-flex flex-column flex-1 container my-3" data-aos="fade-up">
            <div  data-aos="fade-up">
                <a href="https://telemanas.mohfw.gov.in/#/home" target="_blank" rel="noopener noreferrer" className='tele-manas my-2'>
                    <img src={TeleMANAS} alt="TeleMANAS" loading="lazy"/>
                </a>
            </div>
            <div className='d-flex flex-row justify-content-evenly flex-wrap my-4' data-aos="fade-up">
                <div className='d-flex flex-row text-light justify-content-evenly text-decoration-none phoneNo-tele-manas px-2 shadow-lg '>
                    <MdOutlinePhoneInTalk size={25}/>
                    <div className=''>
                    14416
                    </div>
                </div>
                <div className='d-flex flex-row text-light justify-content-evenly text-decoration-none phoneNo-tele-manas px-2 shadow-lg '>
                    <MdOutlinePhoneInTalk size={25}/>
                    <div className=''>
                    1-800 891 4416
                    </div>
                </div>
            </div>
            <div className='py-3' data-aos="fade-up">
            <a href="https://manodarpan.education.gov.in/" target="_blank" rel="noopener noreferrer" className='tele-manas my-2'>
                    <img src={ManoDarpan} alt="ManoDarpan" loading="lazy"/>
                </a>
            </div>
            <div className='py-2' data-aos="fade-up">
            <a href="https://nimhans.ac.in/" target="_blank" rel="noopener noreferrer" className='tele-manas my-2'>
                    <img src={NIMHR} alt="NIMHR" loading="lazy"/>
                </a>
            </div>

        </div>
    );
}
export default UsefullLink;