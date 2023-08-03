import { useState, useEffect, useRef } from 'react'
import React from 'react'
import './Game.css'
import UsersScores from '../UsersScoresPreview/UsersScores.jsx'

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

export default function Game({ setRoute, route, setSocket, socket, room }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isDraw, setIsDraw] = useState(false);
  const [isLight, setIsLight] = useState(true);



  useEffect(() => {
    socket.on('data', (data) => {
      console.log(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.on('game', (data) => {
      setSquares(data.squares);
      setIsDraw(data.isDraw);
      setXIsNext(data.xIsNext);
    });
  }, [socket]);


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

  return (

    <div className={`${isLight ? `body-light` : `body-dark`}`}>
      <BColor color={isLight} state={setIsLight} />
      <h5>{status}</h5>
      <div className='interface'>
        <UsersScores room={room} />
        <div className="game">
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
                setSquares(Array(9).fill(null));
                setIsDraw(false);
                setXIsNext(true);
                socket.emit('game', { squares: Array(9).fill(null), xIsNext: true, isDraw: false });
              }}>Reset</button>
            )}
          </div>

        </div>
      </div>
    </div>


  );

}
