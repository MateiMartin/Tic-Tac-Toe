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
       
        socket.emit('createPrivateGame', playerData);
        setCreateOrJoin('create');

    }

    socket.on('private-room-create', (room) => {
        setRoomId(room.id);
       
    });

    function joinGame() {
       
        setCreateOrJoin('join');
    }

    socket.on('private-room-join', (room) => {
        console.log(room);
        setRoom(room);
    })

    function onKeyDown(e) {
        if (e.keyCode === 13) {
            onJoinClik();
        }
    }

    function handleLeave(){
        if(createOrJoin==="")
            setRoute('startPage');
       else if(createOrJoin==="create"){
            setCreateOrJoin('');
            setRoom(null);
            setRoomId('');
            socket.emit('room-leave-private', roomId);
       }
       else if(createOrJoin==="join"){
            setCreateOrJoin('');
            setRoom(null);
            setInput('');
        
     }
      
    }


    if (createOrJoin === '')
        return (
            <div className="privateG-btns">
                <button onClick={joinGame}>Join Game</button>
                OR
                <button onClick={createGame}>Create Game</button>
                <button id="leave-btn" onClick={handleLeave}>Leave</button>
            </div>
        );
    else if (createOrJoin === 'join')
        return (

            <div className="join-game">
                <h1>Enter the code:</h1>
                <input type="text" onChange={handleInput} placeholder="Enter the code here..." onKeyDown={onKeyDown} />
                <button onClick={onJoinClik}>Join</button>
                <button id="leave-btn" onClick={handleLeave}>Leave</button>
            </div>


        );
    else if (createOrJoin === 'create')
        return (

            <div className="create-game">
                <h1>Send this code to your friend:</h1>
                <h1>" {roomId} "</h1>
                <p>The game will start as soon as he connects...</p>
                <button id="leave-btn" onClick={handleLeave}>Leave</button>
            </div>

        );

};

export default PrivateGame;