import React, { useState, useEffect, ChangeEvent } from 'react';
import '../../App.css';
import './killer.css';

function Killer() {

    const [condition, setCondition] = useState<boolean>(false);

    type PlayerDict = {
        [key: number]: string;
    }

    const [inputPlayersValue, setinputPlayersValue] = useState('');
    const [inputNameValues, setInputNameValues] = useState<PlayerDict>({});
    const [inputNumberValues, setInputNumberValues] = useState<PlayerDict>({});
    const [inputHitValues, setInputHitValues] = useState<PlayerDict>({});
    const [inputIsKillerValues, setIsKillerValues] = useState<PlayerDict>({});

    const names: PlayerDict = {};
    const numbers: PlayerDict = {};
    const hits: PlayerDict = {};
    const killers: PlayerDict = {};

    for (let i = 1; i <= +inputPlayersValue; i++) {
        names[i] = '';
        numbers[i] = '';
        hits[i] = '';
        killers[i] = '';
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
        let currentHit = parseInt((inputHitValues[+key] || '0'));
        if (inputHitValues[+key] === 'KILL') currentHit = 3;
        if (value === 'add') {
            currentHit++;
            if (currentHit === 3) {
                setInputHitValues({
                    ...inputHitValues,
                    [key]: 'KILL'
                });

                setIsKillerValues({
                    ...inputIsKillerValues,
                    [key]: 'KILL'
                })
                return;
            }

            setInputHitValues({
                ...inputHitValues,
                [key]: currentHit
            });
        }
        else if (value === 'minus') {
            if (currentHit === 1 || currentHit === 0) {
                setInputHitValues({
                    ...inputHitValues,
                    [key]: '0'
                });
                return;
            }

            currentHit--;
            setInputHitValues({
                ...inputHitValues,
                [key]: currentHit
            });
        }

    };

    const handleNewGameClick = () => {
        setCondition(true);
    }

    const handleNumberPlayersChange = (value: string) => {
        setinputPlayersValue(value);
    }

    return (
        <div className="App">
            {
                !condition ? (
                    <div className='container'>
                        <div></div>
                        <div className="column App-header">
                            <input
                                className='player-display input'
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
                                            className='killer-display input'
                                            type="text"
                                            id={key}
                                            value={inputNumberValues[+key] || value}
                                            onChange={(e) => handleNumberChange(key, e.target.value)}
                                            placeholder='Number...'
                                        />
                                    ))}
                                </div>
                                <div className="column">
                                    <div>
                                        {Object.entries(numbers).map(([key, value]) => (
                                            <div>
                                                <input
                                                    className={inputHitValues[+key] === 'KILL' ? 'column killer-display flashing-text' : 'column killer-display'}
                                                    disabled
                                                    type="text"
                                                    id={key}
                                                    value={inputHitValues[+key] || value}
                                                    onChange={(e) => handleNumberChange(key, e.target.value)}
                                                />
                                                <button disabled={inputHitValues[+key] === 'KILL'} className='column killer-display' onClick={() => handleHitChange(key, 'add')} >+</button>
                                                <button disabled={inputHitValues[+key] === '0'} className='column killer-display' onClick={() => handleHitChange(key, 'minus')}>-</button>
                                            </div>

                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
            }
        </div>
    );
}

export default Killer;