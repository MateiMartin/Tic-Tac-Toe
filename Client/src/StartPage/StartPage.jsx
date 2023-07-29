import React from "react";
import { useState } from "react";
import './StartPage.css';
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const StartPage = ({ setRoute }) => {
    const [profileNumber, setProfileNumber] = useState(0);

    return (
        <div className="page">
            <div className="profile">
                <div className="img-arrow">
                    <FiArrowLeft size={40} color="#FFFFFF" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setProfileNumber(profileNumber - 1)} />
                    <img src={`https://api.multiavatar.com/${profileNumber}.svg`} alt="imge" />
                    <FiArrowRight size={40} color="#FFFFFF" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setProfileNumber(profileNumber + 1)} />
                </div>
                <input type="text" placeholder="Name..." />
            </div>

            <div className="game-mod">
                <div>
                    <button onClick={() => setRoute('game')}>Online</button>
                    <button onClick={() => setRoute('game')}>With Friends</button>
                </div>
            </div>
        </div>

    )
}

export default StartPage;