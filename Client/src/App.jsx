import React from "react";
import { useState, useEffect } from "react";
import Game from "./Game/Game.jsx";
import StartPage from "./StartPage/StartPage.jsx";
import { io } from "socket.io-client";
import WaitPage from "./WaitPage/WaitPage.jsx";
import PrivateGame from "./PrivateGame/PrivateGame.jsx";

export default function App() {
    const [route, setRoute] = useState('startPage');
    const [socket, setSocket] = useState(null);
    const [room, setRoom] = useState(null);

    const [playerData, setPlayerData] = useState(null);//for private


    useEffect(() => {

      const socket = io("https://tic-tac-toe-zoih4.ondigitalocean.app");
        setSocket(socket);

        socket.on('connect', () => {
            console.log(`You connected with id: ${socket.id}`);
        });

        return () => {
            socket.disconnect();
        }

    }, []);

    if (route === 'startPage')
        return (
            <StartPage setRoute={setRoute} route={route} setSocket={setSocket} socket={socket} setRoom={setRoom} setPlayerData={setPlayerData} />
        )
    else if (route === 'waitPage')
        return (
            <WaitPage setRoute={setRoute} route={route} setSocket={setSocket} socket={socket} room={room} />
        )
    else if (route === 'privateGame')
        return (
            <PrivateGame socket={socket} setRoute={setRoute} setRoom={setRoom} playerData={playerData} room={room} />
        )
    else if (route === 'game')
        return (
            <Game setRoute={setRoute} route={route} setSocket={setSocket} socket={socket} room={room} setRoom={setRoom} />
        )
}
