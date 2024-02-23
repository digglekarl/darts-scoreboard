import React, { useState, useEffect } from 'react';
import '../../App.css';
import './pub.css';
import { Player } from '../../Player';
import { possibleOuts } from '../../PossibleOuts';
import Modal from '../shared/modal'; // Import the Modal component

function Main() {
    let maxScore: number = 301;
    let scores: string[] = [];

    let dartsThrown: number[] = [3, 6, 9, 12, 15, 18, 21];

    const [keyPressed, setKeyPressed] = useState<string>('');
    const [condition, setCondition] = useState<boolean>(false);
    const [display, setDisplay] = useState<string>('');
    const [activePlayer, setActivePlayer] = useState<Player>();
    const [player1IsActive, setPlayer1Active] = useState<boolean>(false);
    const [player2IsActive, setPlayer2Active] = useState<boolean>(false);
    const [showPlayer1Score, setPlayer1Score] = useState<boolean>(false);
    const [showPlayer2Score, setPlayer2Score] = useState<boolean>(false);
    const [players, setPlayers] = useState<{ [key: number]: Player }>({});
    const [legs, setLegs] = useState(6);
    const [currentLeg, setCurrentLeg] = useState(1);
    const [player1Legs, setPlayer1Legs] = useState(0);
    const [player2Legs, setPlayer2Legs] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {

        setIsModalOpen(false);
        setCondition(false);
    };

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

        if (value === 'ERR') {
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
        } else if (value === 'ADD') {
            add();
            setDisplay('');
        } else if (value === 'ENTER') {
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
            if (result === undefined || +result > 180 || +result > activePlayer.remainingScore) {
                resetDisplays();
                return;
            }
            activePlayer.remainingScore = activePlayer.previousScore + +result;
            activePlayer.previousScore = activePlayer.remainingScore;
            if (activePlayer.id === 1) {
                setPlayer1Active(false);
                setPlayer2Active(true);
                setPlayer1Score(false);
                setActivePlayer(players[2]);
            }
            else if (activePlayer.id === 2) {
                setPlayer1Active(true);
                setPlayer2Active(false);
                setPlayer2Score(false);
                setActivePlayer(players[1]);
            }
        }
    }

    const resetDisplays = () => {
        setPlayer1Score(false);
        setPlayer2Score(false);
    }

    const resetGame = () => {

        if (currentLeg !== legs) {
            setCurrentLeg(currentLeg + 1);
        }
        else {
            setIsModalOpen(true);
        }

        if (activePlayer?.id === 1) {
            players[1].active = true;
            setPlayer1Active(true);
            setPlayer2Active(false);
            setPlayer1Legs(player1Legs + 1);
            setPlayer1Score(false);
        }
        else if (activePlayer?.id === 2) {
            players[2].active = true;
            setPlayer1Active(false);
            setPlayer2Active(true);
            setPlayer2Legs(player2Legs + 1);
            setPlayer2Score(false);
        }

        Object.keys(players).forEach((key, value) => {

            var p = players[+key];

            p.remainingScore = maxScore;
            p.previousScore = maxScore;

            p.scores = [maxScore];
        });

    }

    const evaluate = () => {
        try {
            if (activePlayer) {
                const result = eval(display);

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

                if (activePlayer.remainingScore === 0) {
                    resetGame();
                    return;
                }

                if (activePlayer.id === 1) {
                    players[1].active = false;
                    setPlayer1Active(false);
                    setPlayer2Active(true);
                    setPlayer1Score(false);
                    setActivePlayer(players[2]);
                }
                else if (activePlayer.id === 2) {
                    players[2].active = true;
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
        setCurrentLeg(1);
        setPlayer1Legs(0);
        setPlayer2Legs(0);
        setDisplay('');

        maxScore = score;

        players[1] = { id: 1, name: 'HOME', remainingScore: 0, previousScore: 0, computer: false, active: true, scores: [maxScore], averages: [], dartsThrown: 0, avg: {}, legsWon: 0 };
        players[2] = { id: 2, name: 'AWAY', remainingScore: 0, previousScore: 0, computer: false, active: false, scores: [maxScore], averages: [], dartsThrown: 0, avg: {}, legsWon: 0 };

        Object.keys(players).forEach((key, value) => {

            var p = players[+key];

            p.remainingScore = maxScore;
            p.previousScore = maxScore;

            p.legsWon = 0;
        });

        let activePlayer = players[1];

        setActivePlayer(activePlayer);

        setPlayers(players);
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

    enum GameMode {
        Player
    }

    const handleLegsChange = (value: string) => {
        setLegs(+value);
    }

    return (
        <div className="App">
            {
                !condition ? (
                    <div>
                        <header className="App-header">
                            <input
                                className='killer-display centered-input'
                                type="text"
                                value={legs}
                                onChange={(e) => handleLegsChange(e.target.value)}
                                placeholder='Legs'
                            />
                            <button onClick={() => handleNewGameClick(GameMode.Player, 301)}>301</button>
                            <button onClick={() => handleNewGameClick(GameMode.Player, 501)}>501</button>
                        </header>

                    </div>
                ) :
                    (
                        <div>
                            <div className="container">
                                <div className={player1IsActive ? 'column active' : 'column inactive'} >
                                    <div className="player-display" onClick={() => handlePlayerClick(1)}>
                                        <div> {showPlayer1Score ? display : players[1].remainingScore}</div>
                                    </div>

                                    <div className='player-outs-display'>
                                        <div style={{ marginBottom: '5px' }}>{possibleOuts[players[1].remainingScore]}</div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className='container'>
                                        <div className='column'>
                                            <div className='player-display'>{player1Legs}</div>
                                        </div>
                                        <div className='column'>
                                            <img src="./darts.jpg" width="100" height="100"></img>
                                            <div className='med-text'>Leg {currentLeg} of {legs}</div>
                                        </div>
                                        <div className='column'>
                                            <div className='player-display'>{player2Legs}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={player2IsActive ? 'column active' : 'column inactive'}>
                                    <div className="player-display" onClick={() => handlePlayerClick(2)}>
                                        <div> {showPlayer2Score ? display : players[2].remainingScore}</div>
                                    </div>

                                    <div className='player-outs-display'>
                                        <div style={{ marginBottom: '5px' }}>{possibleOuts[players[2].remainingScore]}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="container">
                                <div className='column'>

                                    <div className='container'>

                                        <div className='player-score-display'>
                                            {players[1].scores.map((score, idx) => (
                                                <div key={idx} style={{ marginBottom: '5px' }}>{score}</div>
                                            ))}
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
                                                'ADD', '0', 'ERR'].map(label => (
                                                    <button key={label} onClick={() => handleButtonClick(label)}>
                                                        {label}
                                                    </button>
                                                ))}
                                        </div>
                                        <div className="calculator-submit-button">
                                            <button onClick={() => handleButtonClick('ENTER')}>
                                                ENTER
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='column'>
                                    <div className='container'>
                                        <div className='player-score-display'>
                                            {players[2].scores.map((score, idx) => (
                                                <div key={idx} style={{ marginBottom: '5px' }}>{score}</div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className='container hidden'>
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
            {isModalOpen && <Modal onClose={closeModal} player={activePlayer?.name || ''} />} {/* Render Modal when isModalOpen is true */}
        </div>
    );
}

export default Main;
