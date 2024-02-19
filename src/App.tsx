import React, { useState, useEffect } from 'react';
import './App.css';
import { Player } from './Player';
import { possibleOuts } from './PossibleOuts';

function App() {
  let maxScore: number = 301;
  let scores: string[] = [];

  let dartsThrown: number[] = [3, 6, 9, 12, 15, 18, 21];

  const [keyPressed, setKeyPressed] = useState<string>('');
  const [condition, setCondition] = useState<boolean>(false);
  const [display, setDisplay] = useState<string>('');
  const [player1, setPlayer1] = useState<number>(maxScore);
  const [player2, setPlayer2] = useState<number>(maxScore);
  const [activePlayer, setActivePlayer] = useState<Player>();

  const [player1IsActive, setPlayer1Active] = useState<boolean>(false);
  const [player2IsActive, setPlayer2Active] = useState<boolean>(false);

  const [showPlayer1Score, setPlayer1Score] = useState<boolean>(false);
  const [showPlayer2Score, setPlayer2Score] = useState<boolean>(false);

  const [players, setPlayers] = useState<{ [key: number]: Player }>({});

  const [gameMode, setGameMode] = useState<GameMode>();

  const [player2ComputerScores, setComputerScores] = useState<string[]>([]);



  const handleNewGameClick = (mode: GameMode, score: number) => {
    initGame(mode, score);
    setCondition(true);
  }

  const handlePlayerClick = (value: number) => {

    if (value === 1) {
      setPlayer1Active(true);
      setPlayer2Active(false);
      setActivePlayer(players[1]);
    }
    else if (value === 2) {
      setPlayer2Active(true);
      setPlayer1Active(false);
      setActivePlayer(players[2]);
    }

    setPlayers(players);

  }

  const handleButtonClick = (value: string) => {

    if (value === 'Clear') {
      if (activePlayer) {
        if (activePlayer.id === 1) {
          setPlayer1Score(false);
          setPlayer2Score(false);
        }
        else if (activePlayer.id === 2) {
          setPlayer2Score(false);
          setPlayer1Score(false);
        }
      }
      setDisplay('');
    } else if (value === 'Add') {
      add();
    } else if (value === 'submit') {
      evaluate();
      setDisplay('');
    } else {

      if (activePlayer) {
        if (activePlayer.id === 1) {
          setPlayer1Score(true);
          setPlayer2Score(false);
        }
        else if (activePlayer.id === 2) {
          setPlayer2Score(true);
          setPlayer1Score(false);
        }
      }

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

  const resetDisplays = () => {
    setPlayer1Score(false);
    setPlayer2Score(false);
  }

  const evaluate = () => {
    try {
      const result = eval(display);

      if (activePlayer) {
        if (result === undefined || +result > 180 || +result > activePlayer.remainingScore) {
          resetDisplays();
          return;
        }

        activePlayer.dartsThrown += 3;
        activePlayer.remainingScore = activePlayer.previousScore - +result;
        activePlayer.previousScore = activePlayer.remainingScore;

        activePlayer.scores.push(activePlayer.remainingScore);

        const average = (maxScore - activePlayer?.remainingScore) / activePlayer?.dartsThrown;
        activePlayer?.averages.push(Math.ceil(average));

        activePlayer.avg[activePlayer.dartsThrown] = Math.ceil(average);

        if (activePlayer.remainingScore == 0) {
          setCondition(false);
        }

        if (activePlayer.id === 1) {
          players[1].active = false;
          setPlayer1(activePlayer.remainingScore);
          setPlayer1Active(false);
          setPlayer2Active(true);
          setPlayer1Score(false);
          setActivePlayer(players[2]);
        }
        else if (activePlayer.id === 2) {
          players[2].active = true;
          setPlayer2(activePlayer.remainingScore);
          setPlayer1Active(true);
          setPlayer2Active(false);
          setPlayer2Score(false);
          setActivePlayer(players[1]);
        }
      }
    } catch (error) {
      setDisplay('Error');
    }
  };

  const initGame = (mode: GameMode, score: number) => {

    maxScore = score;
    players[1] = { id: 1, name: 'HOME', remainingScore: 0, previousScore: 0, computer: false, active: false, scores: [score], averages: [], dartsThrown: 0, avg: {} };
    players[2] = { id: 2, name: 'AWAY', remainingScore: 0, previousScore: 0, computer: false, active: false, scores: [score], averages: [], dartsThrown: 0, avg: {} };

    if (mode === GameMode.Computer) {
      players[2].computer = true;
    }

    Object.keys(players).forEach((key, value) => {

      var p = players[+key];

      p.remainingScore = maxScore;
      p.previousScore = maxScore;
    });

    let activePlayer = players[1];
    setPlayer1Active(true);
    setActivePlayer(activePlayer);

    setPlayers(players);

    setPlayer1(players[1].remainingScore);
    setPlayer2(players[2].remainingScore);

  }


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {

      if (/^\d*$/.test(event.key)) {
        handleButtonClick(event.key);
      }
      else if (event.key === 'Enter') {
        handleButtonClick('submit');
      }

      setKeyPressed(event.key);

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

  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const calculateScore = () => {
    // Assuming standard scoring rules, where a dart throw can result in 0 to 20 points, or a bullseye (25 or 50)
    const possibilities: number[] = [...Array(21).keys(), 25, 50];
    const index = getRandomNumber(0, possibilities.length - 1);

    var score = possibilities[index];

    if (score === 0 || score === 25) {
      scores.push(`${score}`);
      return score;
    }

    if (score === 50) {
      scores.push(`Bull`);
      return score;
    }

    let dartScore = 0;

    // Randomly decide whether it's single, double, or triple
    const area = getRandomNumber(1, 3);
    if (area === ScoringArea.Double) {
      dartScore = score * 2;
      scores.push(`D${score}`);
      //return score * 2; // Double score
    } else if (area === ScoringArea.Triple) {
      dartScore = score * 3;
      scores.push(`T${score}`);
      //return score * 3; // Triple score
    } else {
      dartScore = score;
      scores.push(`${score}`);
      //return score; // Single score
    }


    return dartScore;
  }

  async function computerTurnWithDelay(): Promise<number> {
    const delay = 1000; // Delay in milliseconds
    let totalScore = 0;
    for (let i = 0; i < 3; i++) {
      await new Promise<void>(resolve => setTimeout(resolve, delay)); // Add delay between throws
      const score = calculateScore();

      setComputerScores(scores);
      totalScore += score;


      /*totalScore -= score;
      if (totalScore === 2) { // Check if the player's remaining score is exactly 2
        return totalScore; // Player finishes the game
      }*/
    }


    var p = players[2];


    if (+totalScore > p.remainingScore) {
      resetDisplays();

      setPlayer1Active(true);
      setPlayer2Active(false);
      setPlayer2Score(false);

      setActivePlayer(players[1]);

      return 0;
    }

    p.remainingScore = p.previousScore - +totalScore;
    p.previousScore = p.remainingScore;
    p.active = false;

    p.scores.push(p.remainingScore);

    p.dartsThrown += 3;

    const average = (maxScore - p?.remainingScore) / p?.dartsThrown;
    p?.averages.push(Math.ceil(average));

    p.avg[p.dartsThrown] = Math.ceil(average);

    setPlayers(players);

    setPlayer2(p.remainingScore);
    setPlayer1Active(true);
    setPlayer2Active(false);
    setActivePlayer(players[1]);

    return totalScore;
  }

  const computerTurn = () => {

    const throws = 3;
    let totalScore = 0;
    for (let i = 0; i < throws; i++) {
      const score = calculateScore();
      totalScore += score;
    }

    var p = players[2];

    if (+totalScore > p.remainingScore) {
      resetDisplays();
      return 0;
    }

    p.remainingScore = p.previousScore - +totalScore;
    p.previousScore = p.remainingScore;
    p.active = false;

    setPlayers(players);

    setPlayer2(p.remainingScore);
    setPlayer1Active(true);
    setPlayer2Active(false);
    setActivePlayer(players[1]);

  }

  enum GameMode {
    Player,
    Computer
  }

  enum ScoringArea {
    Single = 1,
    Double = 2,
    Triple = 3
  }

  return (
    <div className="App">
      {
        !condition ? (
          <header className="App-header">
            <button onClick={() => handleNewGameClick(GameMode.Player, 301)}>301</button>
            <button onClick={() => handleNewGameClick(GameMode.Player, 501)}>501</button>
            <button onClick={() => handleNewGameClick(GameMode.Computer, 301)}>New Game With Computer</button>
          </header>
        ) :
          (
            <div>
              <div className="container">
                <div className="column">
                  <header className="column-header">
                    {players[1].name}
                  </header>
                  <svg width="100" height="100">
                    {player1IsActive ? <circle cx="50" cy="50" r="40" fill="red" /> : <circle cx="50" cy="50" r="40" fill="#282c34" stroke="#667083" />}
                  </svg>
                </div>
                <div className="column">
                  <header className="column-header">
                    Darts Scoreboard
                  </header>
                  <img src="./darts.jpg" width="100" height="100"></img>
                </div>
                <div className="column">
                  <header className="column-header">
                    {players[2].name}
                  </header>
                  <svg width="100" height="100">
                    {player2IsActive ? <circle cx="50" cy="50" r="40" fill="red" /> : <circle cx="50" cy="50" r="40" fill="#282c34" stroke="#667083" />}
                  </svg>
                </div>
              </div>

              <div className="container">
                <div className={player1IsActive ? 'column active' : 'column inactive'} >
                  <div className="player-display" onClick={() => handlePlayerClick(1)}>
                    <div> {showPlayer1Score ? display : player1}</div>
                  </div>

                  <div className='container'>

                    <div className='column player-score-display'>
                      {players[1].scores.map((score, idx) => (
                        <div key={idx} style={{ marginBottom: '5px' }}>{score}</div>
                      ))}
                    </div>

                    <div className='column player-outs-display'>
                      <div style={{ marginBottom: '5px' }}>{possibleOuts[players[1].remainingScore]}</div>
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="calculator">
                    <div className="calculator-display hidden">{display}</div>
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
                    <div> {showPlayer2Score ? display : player2}</div>
                  </div>

                  <div className='container'>
                    <div className='column player-score-display'>
                      {players[2].scores.map((score, idx) => (
                        <div key={idx} style={{ marginBottom: '5px' }}>{score}</div>
                      ))}
                    </div>

                    <div className='column player-outs-display'>
                      <div style={{ marginBottom: '5px' }}>{possibleOuts[players[2].remainingScore]}</div>
                    </div>
                  </div>

                  <div className={players[2].computer === true ? 'computer-score-display' : ' hidden'}>
                    {player2ComputerScores.join(",")}
                  </div>

                  <div className={player2IsActive && players[2].computer === true ? 'computer-submit-button' : 'hidden'}><button onClick={() => computerTurnWithDelay()}>Computer Turn</button></div>
                </div>

              </div>

              <div className='container'>
                <div className='column player-averages-display'>
                  <div>Averages</div>
                  <div>Player 1</div>
                  <div>Player 2</div>
                </div>

                {dartsThrown.map((d, idx) => (
                  <div className='column player-averages-display'>
                    <div key={idx}>{d} Darts</div>
                    <div key={`player1 ${idx}`}>{players[1].avg[d]}</div>
                    <div key={`player2 ${idx}`}>{players[2].avg[d]}</div>
                  </div>
                ))}


              </div>

            </div>

          )}
    </div>
  );
}

export default App;
