import React from "react";
import { useState, useEffect } from "react";
import './UsersScores.css'

const UsersScores = ({ room, winner, isLight }) => {
    console.log(room)
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    //player1 = X
    //player2 = O
    useEffect(() => {
        if (winner) {
            if (winner[0] === 'X') {
                setPlayer1Score(player1Score + 1)
            } else {
                setPlayer2Score(player2Score + 1)
            }
        }
    }, [winner])
    console.log(winner)

    function Color(isLight) {
        if (isLight)
            return { color: 'black' }
        else
            return { color: 'white' }

    }

    return (
        <div className="players-scores">
            <div className="player">
                <img src={`https://api.multiavatar.com/${room.user1Data.profileNum}.svg`} alt="player1" />
                <h6 style={Color(isLight)}>{room.user1Data.name}</h6>
                <h4 style={Color(isLight)}>Score: {player1Score}</h4>
            </div>
            <div className="player">
                <img src={`https://api.multiavatar.com/${room.user2Data.profileNum}.svg`} alt="player2" />
                <h6 style={Color(isLight)}>{room.user2Data.name}</h6>
                <h4 style={Color(isLight)}>Score: {player2Score}</h4>
            </div>
        </div>
    )
};

export default UsersScores;