import React from "react";
import { useState, useEffect } from "react";
import Game from "./Game/Game.jsx";
import StartPage from "./StartPage/StartPage.jsx";
import { io } from "socket.io-client";
import WaitPage from "./WaitPage/WaitPage.jsx";

export default function App() {
    const [route, setRoute] = useState('startPage');
    const [socket, setSocket] = useState(null);
    const [room, setRoom] = useState();


    useEffect(() => {

        const socket = io('http://localhost:3001');
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
            <StartPage setRoute={setRoute} route={route} setSocket={setSocket} socket={socket} setRoom={setRoom} />
        )
    else if(route === 'waitPage')
            return (
                <WaitPage setRoute={setRoute} route={route} setSocket={setSocket} socket={socket} room={room} />
            )
    else if (route === 'game')
        return (
            <Game setRoute={setRoute} route={route} setSocket={setSocket} socket={socket} room={room} />
        )
}