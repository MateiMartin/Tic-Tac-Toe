import { useState, useEffect, useRef } from 'react'
import React from 'react'
import './Game.css'
import UsersScores from '../UsersScores/UsersScores.jsx'
import Chat from '../Chat/Chat.jsx'

function Square({ value, onSquareClick, poz, winner }) {
  return (
    <button className={`${winner && winner[1].includes(poz) && 'Red'} square`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function BColor({ color, state }) {
  return (<button className={`${color ? `dark` : `light`}`} onClick={() => state(!color)}>{color ? `Dark` : `Light`}</button>);
}

function calculateWinner(squares) {
  const lines = [[0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}

export default function Game({ setRoute, route, setSocket, socket, room, setRoom }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isDraw, setIsDraw] = useState(false);
  const [isLight, setIsLight] = useState(true);
  const [resetCnt, setResetCnt] = useState(0);
  const [isResetBtnActive, setIsResetBtnActive] = useState(false);


  useEffect(() => {
    let body = document.querySelector('body');

    let overlay = document.createElement('div');

    overlay.className = 'popup-overlay-leave';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.flexDirection = 'column';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backdropFilter = 'blur(5px)'

    let popup = document.createElement('div');
    popup.className = 'popup-leave';

    let whatIsPlayerPlayingWith;
    if (socket.id === room.user1Data.id)
      whatIsPlayerPlayingWith = 'X'
    else
      whatIsPlayerPlayingWith = 'O'


    popup.innerHTML = `
    <h1>Your are playing with ${whatIsPlayerPlayingWith}</h1>
  `;

    overlay.appendChild(popup);

    body.appendChild(overlay);

    setTimeout(() => {
      popup.remove();
      overlay.remove();
    }, 2000);
    
  }, []);

  useEffect(() => {
    socket.on('data', (data) => {
     
    });
  }, [socket]);

  useEffect(() => {
    socket.on('game', (data) => {
      setSquares(data.squares);
      setIsDraw(data.isDraw);
      setXIsNext(data.xIsNext);
    });
  }, [socket]);

  useEffect(() => {
    if (isResetBtnActive === true && !document.querySelector('.Again'))
      setIsResetBtnActive(false);
  }, [squares])

  useEffect(() => {

  }, []);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    let drawChacker = false
    if (nextSquares.every(square => square !== null)) {
      setIsDraw(true);
      drawChacker = true
    }

    socket.emit('game', { squares: nextSquares, xIsNext: !xIsNext, isDraw: drawChacker });
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = `The winner is ${winner[0]}`;
  } else if (isDraw) {
    status = `It's a draw!`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  function isNext() {
    if (room) {
      let playerId = socket.id;
      if (playerId === room.user1Data.id)
        return 'X'
      else if (playerId === room.user2Data.id)
        return 'O'
    }
  }

  function nexEvent() {
    if (!isDraw && !winner) {
      if (xIsNext && isNext() === 'O')
        return { pointerEvents: 'none' }
      else if (xIsNext && isNext() === 'X')
        return { pointerEvents: 'auto' }
      else if (!xIsNext && isNext() === 'X')
        return { pointerEvents: 'none' }
      else if (!xIsNext && isNext() === 'O')
        return { pointerEvents: 'auto' }
    }
    else
      return { pointerEvents: 'auto' }

  }

  function Color(isLight) {
    if (isLight)
      return { color: 'black' }
    else
      return { color: 'white' }

  }

  function onLeavePress() {
    socket.emit('room-leave', room);
    setRoute('startPage');
  }

  socket.on('user-disconnected', () => {
    
    setRoom(null);

    let body = document.querySelector('body');

    let overlay = document.createElement('div');

    overlay.className = 'popup-overlay-leave';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.flexDirection = 'column';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backdropFilter = 'blur(5px)'

    let popup = document.createElement('div');
    popup.className = 'popup-leave';
    popup.innerHTML = `
    <h1>Your opponent has disconnected</h1>
    <h2>You will be directed to the start page...</h2>
  `;

    overlay.appendChild(popup);

    body.appendChild(overlay);

    setTimeout(() => {
      popup.remove();
      overlay.remove();
      setRoute('startPage');
    }, 2000);

  })

  socket.on('toReset', (players) => {
    if (players === 2) {
      setTimeout(() => {
        setResetCnt(0);
        setSquares(Array(9).fill(null));
        setIsDraw(false);
        setXIsNext(true);
        socket.emit('game', { squares: Array(9).fill(null), xIsNext: true, isDraw: false });
      }, 350);

    }
    else {
      setResetCnt(players)
    }
  });


  return (
    <div className={`${isLight ? `body-light` : `body-dark`}`}>
      <BColor color={isLight} state={setIsLight} />

      <div className='interface' >
        <UsersScores room={room} winner={winner} isLight={isLight} resetCnt={resetCnt} />
        <div style={nexEvent() === { pointerEvents: 'none' } ? { cursor: 'crosshair' } : { cursor: 'not-allowed' }}>
          <div className="game" style={nexEvent()}>
            <h5 style={Color(isLight)}>{status}</h5>
            <div className="board-row">
              <Square poz={0} value={squares[0]} onSquareClick={() => handleClick(0)} winner={winner} />
              <Square poz={1} value={squares[1]} onSquareClick={() => handleClick(1)} winner={winner} />
              <Square poz={2} value={squares[2]} onSquareClick={() => handleClick(2)} winner={winner} />
            </div>
            <div className="board-row">
              <Square poz={3} value={squares[3]} onSquareClick={() => handleClick(3)} winner={winner} />
              <Square poz={4} value={squares[4]} onSquareClick={() => handleClick(4)} winner={winner} />
              <Square poz={5} value={squares[5]} onSquareClick={() => handleClick(5)} winner={winner} />
            </div>
            <div className="board-row">
              <Square poz={6} value={squares[6]} onSquareClick={() => handleClick(6)} winner={winner} />
              <Square poz={7} value={squares[7]} onSquareClick={() => handleClick(7)} winner={winner} />
              <Square poz={8} value={squares[8]} onSquareClick={() => handleClick(8)} winner={winner} />
            </div>

            <div className='btn-again'>
              {(winner || isDraw) && (
                <button className='Again' onClick={() => {
                  setResetCnt(resetCnt + 1);
                  socket.emit('toReset', resetCnt + 1, room);
                  setIsResetBtnActive(true)
                }} style={isResetBtnActive ? { pointerEvents: 'none' } : {}}>
                  {resetCnt === 0 ? 'Reset' : `Reset ${resetCnt}/2`}
                </button>
              )}
            </div>

          </div>
        </div>
        <Chat socket={socket} room={room} />
      </div>
      <button id="leave-btn" onClick={onLeavePress}>Leave</button>
    </div>


  );

}
