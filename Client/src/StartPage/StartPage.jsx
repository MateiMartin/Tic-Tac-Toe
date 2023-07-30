import React from "react";
import { useState, useEffect } from "react";
import './StartPage.css';
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { io } from "socket.io-client";

const StartPage = ({ setRoute }) => {
    const [profileNumber, setProfileNumber] = useState(0);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Establish a connection to the server using Socket.io
        const newSocket = io("http://localhost:3001"); // Replace with your server URL
        setSocket(newSocket);

        // Specify how to clean up after this effect:
        // return function cleanup() {
        //     newSocket.disconnect();
        // };
        //mouve to game page

    }, []);

    const handleOnlineClick = () => {
        if (socket) {
            // Emit the 'joinOrCreateRoom' event to the server when the "Online" button is clicked
            socket.emit("joinOrCreateRoom");

            // Listen for the 'roomJoined' event from the server
            socket.on("roomJoined", (roomId) => {
                console.log("You joined room:", roomId);
                // Handle the response from the server here.
                // You can update the UI or take any other appropriate actions.
                // For example, you can navigate to the game page by setting the route.
                setRoute("game");
            });
        }
    };



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
                    <button onClick={handleOnlineClick}>Online</button>
                    <button onClick={() => setRoute('game')}>With Friends</button>
                </div>
            </div>
        </div>

    )
}

export default StartPage;