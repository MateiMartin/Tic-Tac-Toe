import React from "react";
import { useState } from "react";
import Game from "./Game/Game.jsx";
import StartPage from "./StartPage/StartPage.jsx";

export default function App() {
    const [route,setRoute] = useState('startPage');
    if(route === 'startPage')
     return(
         <StartPage setRoute={setRoute}/>
     )
    else if(route === 'game')
    return (
        <Game />
    )
}