import React from "react";
import { useState, useEffect } from "react";
import './UsersScores.css'

const UsersScores = ({ room }) => {
    console.log(room)
    return (
        <div className="players-scores">
            <img src={`https://api.multiavatar.com/${room.user1Data.profileNum}.svg`} alt="player1" />
            <img src={`https://api.multiavatar.com/${room.user2Data.profileNum}.svg`} alt="player2" />
        </div>
    )
};

export default UsersScores;