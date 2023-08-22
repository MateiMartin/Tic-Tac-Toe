import React, { useEffect } from "react";
import { useState } from "react";
import "./PrivateGames.css"

const PrivateGame = ({ socket, setRoute, setRoom, playerData, room }) => {

    const [createOrJoin, setCreateOrJoin] = useState('');
    const [roomId, setRoomId] = useState('');
    const [input, setInput] = useState('');


    useEffect(() => {
        if (room) {
            setRoute('game');
        }
    }, [room]);

    function handleInput(e) {
        setInput(e.target.value);
    }

    function onJoinClik() {

        console.log('room', input);
        socket.emit('joinPrivateGame', input, playerData);
    }

    function createGame() {
        console.log(playerData);
        socket.emit('createPrivateGame', playerData);
        setCreateOrJoin('create');

    }

    socket.on('private-room-create', (room) => {
        setRoomId(room.id);
        console.log(room.id);
    });

    function joinGame() {
        console.log(playerData);
        setCreateOrJoin('join');
    }

    socket.on('private-room-join', (room) => {
        console.log(room);
        setRoom(room);
    })



    if (createOrJoin === '')
        return (
            <div className="privateG-btns">
                <button onClick={joinGame}>Join Game</button>
                OR
                <button onClick={createGame}>Create Game</button>
            </div>
        );
    else if (createOrJoin === 'join')
        return (

            <div className="join-game">
                <h1>Enter the code:</h1>
                <input type="text" onChange={handleInput} />
                <button onClick={onJoinClik}>Join</button>
            </div>


        );
    else if (createOrJoin === 'create')
        return (

            <div className="create-game">
                <h1>Send this code to your friend:</h1>
                <h1>" {roomId} "</h1>
                <p>The game will start as soon as he connects...</p>

            </div>

        );

};

export default PrivateGame;