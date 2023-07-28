import React from "react";
import { useState } from "react";
import './StartPage.css';

const StartPage = ({ setRoute }) => {
    const [profileNumber, setProfileNumber] = useState(0);

    return (
        <div className="page">
            <div className="profile">
                <img src={`https://robohash.org/${profileNumber}/?set=set5`} alt="imge" />
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