import React from "react";
import { useState, useEffect } from "react";
import './StartPage.css';
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { io } from "socket.io-client";

const StartPage = ({ setRoute, route, setSocket, socket, setRoom }) => {
    const [profileNumber, setProfileNumber] = useState(0);
    const [input, setInput] = useState('');



    function handleOnlineClick() {

        socket.emit('join-room', { name: input, profileNum: profileNumber, id: socket.id })
        socket.on('room-info', (data) => {
            setRoom(data);
            console.log(data);
        });
        setRoute('waitPage');
    }

    function handleWithFriendsClick() {
       setRoute('privateGame')
    }



    const handleInputChange = (event) => {
        setInput(event.target.value);
    };


    return (
        <div className="page">
            <div className="profile">
                <div className="img-arrow">
                    <FiArrowLeft size={40} color="#FFFFFF" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setProfileNumber(profileNumber - 1)} />
                    <img src={`https://robohash.org/${profileNumber}`} alt="imge" />
                    <FiArrowRight size={40} color="#FFFFFF" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setProfileNumber(profileNumber + 1)} />
                </div>
                <input type="text" placeholder="Name..." value={input} onChange={handleInputChange} />
            </div>

            <div className="game-mod">
                <div>
                    <button onClick={handleOnlineClick}>Online</button>
                    <button onClick={handleWithFriendsClick}>With Friends</button>
                </div>
            </div>
        </div>

    )
}

export default StartPage;