import React from "react";
import { useState,useEffect } from "react";
import Game from "./Game/Game.jsx";
import StartPage from "./StartPage/StartPage.jsx";
import { io } from "socket.io-client";

export default function App() {
    const [route, setRoute] = useState('startPage');
    const [socket, setSocket] = useState(null);

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
            <StartPage setRoute={setRoute} route={route} setSocket={setSocket} socket={socket} />
        )
    else if (route === 'game')
        return (
            <Game setRoute={setRoute} route={route} setSocket={setSocket} socket={socket} />
        )
}