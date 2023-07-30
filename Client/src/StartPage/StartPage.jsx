import React from "react";
import { useState, useEffect } from "react";
import './StartPage.css';
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { io } from "socket.io-client";

const StartPage = ({ setRoute, route, setSocket, socket }) => {
    const [profileNumber, setProfileNumber] = useState(0);
    const [input, setInput] = useState('');


    useEffect(() => {

        const socket = io('http://localhost:3001');
        setSocket(socket);

        socket.on('connect', () => {
            console.log(`You connected with id: ${socket.id}`);
        });

    }, []);


    function handleOnlineClick() {

        socket.emit('data', { name: input, profileNum: profileNumber, id: socket.id })

        setRoute('game');
    }

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };


    return (
        <div className="page">
            <div className="profile">
                <div className="img-arrow">
                    <FiArrowLeft size={40} color="#FFFFFF" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setProfileNumber(profileNumber - 1)} />
                    <img src={`https://api.multiavatar.com/${profileNumber}.svg`} alt="imge" />
                    <FiArrowRight size={40} color="#FFFFFF" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setProfileNumber(profileNumber + 1)} />
                </div>
                <input type="text" placeholder="Name..." value={input} onChange={handleInputChange} />
            </div>

            <div className="game-mod">
                <div>
                    <button onClick={handleOnlineClick}>Online</button>
                    <button onClick={() => setRoute('game')}>With Friends</button>
                </div>
            </div>
        </div>

    )
}

export default StartPage;