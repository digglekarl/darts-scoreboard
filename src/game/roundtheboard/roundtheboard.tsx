import React, { useState, useEffect, ChangeEvent } from 'react'

import './roundtheboard.css';

function RoundTheBoard() {

    const [condition, setCondition] = useState<boolean>(false);

    type PlayerDict = {
        [key: number]: string;
    }

    const names: PlayerDict = {};
    const numbers: PlayerDict = {};

    const [inputPlayersValue, setinputPlayersValue] = useState('4');
    const [inputNameValues, setInputNameValues] = useState<PlayerDict>({});
    const [inputNumberValues, setInputNumberValues] = useState<PlayerDict>({});

    for (let i = 1; i <= +inputPlayersValue; i++) {
        names[i] = `Player ${i}`;
        numbers[i] = '0';
    }

    const handleNewGameClick = () => {
        setCondition(true);
    }

    const handleNumberPlayersChange = (value: string) => {
        setinputPlayersValue(value);
    }

    const handleNameChange = (key: string, value: string) => {
        setInputNameValues({
            ...inputNameValues,
            [key]: value
        });
    };

    const handleNumberChange = (key: string, value: string) => {
        setInputNumberValues({
            ...inputNumberValues,
            [key]: value
        });
    };

    const handleHitChange = (key: string, value: string) => {
        let currentNumber = parseInt((inputNumberValues[+key] || '1'));

        if (twentyFive[value].includes(currentNumber)) {
            setInputNumberValues({
                ...inputNumberValues,
                [key]: '25'
            });
        }
        else if (bull[value].includes(currentNumber)) {
            setInputNumberValues({
                ...inputNumberValues,
                [key]: 'BULL'
            });
        }
        else if (value === 'x1') {
            setInputNumberValues({
                ...inputNumberValues,
                [key]: currentNumber += 1
            });
        }
        else if (value === 'x2') {
            setInputNumberValues({
                ...inputNumberValues,
                [key]: currentNumber += 2
            });
        }
        else if (value === 'x3') {

            setInputNumberValues({
                ...inputNumberValues,
                [key]: currentNumber += 3
            });
        }
    };
    return (
        <div className="App">
            {
                !condition ? (
                    <div className='container'>
                        <div></div>
                        <div className="column App-header">
                            <input
                                className='player-display centered-input'
                                type="text"
                                id="numPlayers"
                                value={inputPlayersValue}
                                onChange={(e) => handleNumberPlayersChange(e.target.value)}
                                placeholder='Players...'
                            />
                            <button onClick={() => handleNewGameClick()}>Start Game</button>
                        </div>
                        <div></div>
                    </div>
                ) :
                    (
                        <div>
                            <div className="container">
                                <div className="column">
                                    {Object.entries(names).map(([key, value]) => (
                                        <input
                                            className='killer-display input'
                                            type="text"
                                            id={key}
                                            value={inputNameValues[+key] || value}
                                            onChange={(e) => handleNameChange(key, e.target.value)}
                                            placeholder='Name...'
                                        />
                                    ))}
                                </div>
                                <div className="column">
                                    {Object.entries(numbers).map(([key, value]) => (
                                        <input
                                            className={inputNumberValues[+key] === 'BULL' ? 'killer-display input flashing-text' : 'killer-display input'}
                                            disabled
                                            type="text"
                                            id={key}
                                            value={inputNumberValues[+key] || value}
                                            onChange={(e) => handleNumberChange(key, e.target.value)}
                                            placeholder='Number...'
                                        />
                                    ))}
                                </div>
                                <div className="column">
                                    {Object.entries(numbers).map(([key, value]) => (
                                        <div>
                                            <button className='killer-display' onClick={() => handleHitChange(key, 'x1')} >x1</button>
                                            <button disabled={inputNumberValues[+key] === '25' || inputNumberValues[+key] === 'BULL'} className='killer-display' onClick={() => handleHitChange(key, 'x2')} >x2</button>
                                            <button disabled={inputNumberValues[+key] === '25' || inputNumberValues[+key] === 'BULL'} className='killer-display' onClick={() => handleHitChange(key, 'x3')} >x3</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}

export const twentyFive: { [key: string]: Array<number> } = {
    'x1': [20],
    'x2': [19],
    'x3': [18]
}

export const bull: { [key: string]: Array<number> } = {
    'x1': [25],
    'x2': [20],
    'x3': [19, 20]
}

export default RoundTheBoard