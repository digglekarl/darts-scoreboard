import React, { useState, useEffect } from 'react';
import './App.css';
import { Player } from './Player';

function App() {
  let maxScore: number = 301;

  const [keyPressed, setKeyPressed] = useState<string>('');
  const [condition, setCondition] = useState<boolean>(false);
  const [display, setDisplay] = useState<string>('');
  const [player1, setPlayer1] = useState<number>(maxScore);
  const [player2, setPlayer2] = useState<number>(maxScore);
  const [activePlayer, setActivePlayer] = useState<Player>();

  const [player1IsActive, setPlayer1Active] = useState<boolean>(false);
  const [player2IsActive, setPlayer2Active] = useState<boolean>(false);

  const [players, setPlayers] = useState<{ [key: number]: Player }>({});

  const handleNewGameClick = () => {
    initGame();
    setCondition(true);
  }

  const handlePlayerClick = (value: number) => {
    
    Object.keys(players).forEach((key, value) => {

      var p = players[+key];

      if (p.id === value){
        p.active = true;
      }
      else {
        p.active = false;
      }
    });
    
    if (value === 1){
      setPlayer1Active(true);
      setPlayer2Active(false);
      //setActivePlayer()
    } 
    else if (value === 2) {
       setPlayer2Active(true);
       setPlayer1Active(false);
    }

    setPlayers(players);

  }

  const handleButtonClick = (value: string) => {
    if (value === 'Clear') {
      setDisplay('');
    } else if (value=== 'Add') {
      add();
    } else if (value === 'submit') {
      evaluate();
      setDisplay('');
    } else {
      setDisplay(prevDisplay => prevDisplay + value);
    }
  };

  const add = () => {
    const result = eval(display);
    if (activePlayer) {

      activePlayer.remainingScore = activePlayer.previousScore + +result;
      activePlayer.previousScore = activePlayer.remainingScore;
      if (activePlayer.id === 1) setPlayer1(activePlayer.remainingScore);
      else if (activePlayer.id === 2) setPlayer2(activePlayer.remainingScore);
    }
  }

  const evaluate = () => {
    try {
      const result = eval(display);
      if (activePlayer) {

        activePlayer.remainingScore = activePlayer.previousScore - +result;
        activePlayer.previousScore = activePlayer.remainingScore;
        activePlayer.active = false;

        if (activePlayer.remainingScore == 0) {
          setCondition(false);
        }

        if (activePlayer.id === 1) {
          setPlayer1(activePlayer.remainingScore);
          setPlayer1Active(false);
          setPlayer2Active(true);
          setActivePlayer(players[2]);
        }
        else if (activePlayer.id === 2) {
          setPlayer2(activePlayer.remainingScore);
          setPlayer1Active(true);
          setPlayer2Active(false);
          setActivePlayer(players[1]);
        }
      }
    } catch (error) {
      setDisplay('Error');
    }
  };

  const initGame = () => {

    players[1] = { id: 1, name: 'Player 1', active: false, remainingScore: 0, previousScore: 0 };
    players[2] = { id: 2, name: 'Player 2', active: false, remainingScore: 0, previousScore: 0 };

    Object.keys(players).forEach((key, value) => {

      var p = players[+key];

      p.remainingScore = maxScore;
      p.previousScore = maxScore;
    });

    let activePlayer = players[1];
    activePlayer.active = true;
    setPlayer1Active(true);
    setActivePlayer(activePlayer);

    setPlayers(players);
    
    setPlayer1(players[1].remainingScore);
    setPlayer2(players[2].remainingScore);

  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeyPressed(event.key);
      if (event.key === 'Enter'){
        handleButtonClick('submit');
      }
      else {
        handleButtonClick(event.key);
      }
      
    };

    const handleKeyUp = () => {
      setKeyPressed('');
    };


    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Clean up the event listeners
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // Empty dependency array ensures that this effect runs only once

  return (
    <div className="App">
      {
        !condition ? (
          <header className="App-header">
            <button onClick={() => handleNewGameClick()}>New Game</button>
          </header>
        ) :
          (
            <div>
              <div className="container">
                <div className="column">
                  <header className="column-header">
                    Player 1
                  </header>
                </div>
                <div className="column">
                  <header className="column-header">
                    Darts Scoreboard
                  </header>
                </div>
                <div className="column">
                  <header className="column-header">
                    Player 2
                  </header>
                </div>
              </div>

              <div className="container">
                <div className={player1IsActive ? 'column active' : 'column inactive'} >
                  <div className="player-display" onClick={() => handlePlayerClick(1)}>
                    <label id="player1-score">{player1}</label>
                  </div>
                </div>
                <div className="column">
                  <div className="calculator">
                    <div className="calculator-display">{display}</div>
                    <div className="calculator-buttons">
                      {['1', '2', '3',
                        '4', '5', '6',
                        '7', '8', '9',
                        'Clear', '0', 'Add'].map(label => (
                          <button key={label} onClick={() => handleButtonClick(label)}>
                            {label}
                          </button>
                        ))}
                    </div>
                    <div className="calculator-submit-button">
                      <button onClick={() => handleButtonClick('submit')}>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
                <div className={player2IsActive ? 'column active' : 'column inactive'}>
                  <div className="player-display" onClick={() => handlePlayerClick(2)}>
                    <label id="player2-score">{player2}</label>
                  </div>
                </div>
              </div>

              <div>
                <label></label>
              </div>
            </div>

          )}
    </div>
  );
}

export default App;
