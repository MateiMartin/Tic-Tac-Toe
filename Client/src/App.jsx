import React from "react";
import { useState } from "react";
import Game from "./Game/Game.jsx";
import StartPage from "./StartPage/StartPage.jsx";

export default function App() {
    const [route, setRoute] = useState('startPage');
    const [socket, setSocket] = useState(null);
    if (route === 'startPage')
        return (
            <StartPage setRoute={setRoute} route={route} setSocket={setSocket} socket={socket} />
        )
    else if (route === 'game')
        return (
            <Game setRoute={setRoute} route={route} setSocket={setSocket} socket={socket} />
        )
}