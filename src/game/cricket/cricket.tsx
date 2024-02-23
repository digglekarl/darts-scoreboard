import React, { useState } from 'react'

function Cricket() {

    const [condition, setCondition] = useState<boolean>(false);

    interface Circle {
        cx: number,
        cy: number,
        r: number,
        fill: string,
        stroke: string,
    }

    type PlayerDict = {
        [key: number]: string;
    }

    type CircleDict = {
        [key: string]: Circle[]
    };

    type ScoreDict = {
        [key: string]: CircleDict;
    }

    const [circles, setCircles] = useState<CircleDict>({
        '20': [
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' },
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' },
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' }
        ],
        '19': [
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' },
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' },
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' }
        ],
        '18': [
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' },
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' },
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' }
        ],
        '17': [
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' },
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' },
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' }
        ],
        '16': [
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' },
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' },
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' }
        ],
        '15': [
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' },
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' },
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' }
        ],
        'BULL': [
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' },
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' },
            { cx: 20, cy: 20, r: 10, fill: 'none', stroke: '#667083' }
        ]
    });

    const scores: Array<string> = ['15', '16', '17', '18', '19', '20', 'BULL'];

    const [inputPlayersValue, setinputPlayersValue] = useState('4');
    const [inputNameValues, setInputNameValues] = useState<PlayerDict>({});
    const [inputHitValues, setInputHitValues] = useState<ScoreDict>({});

    const names: PlayerDict = {};
    const hits: ScoreDict = {};

    for (let i = 1; i <= +inputPlayersValue; i++) {
        names[i] = '';
        hits[i] = circles
    }

    const handleNameChange = (key: string, value: string) => {
        setInputNameValues({
            ...inputNameValues,
            [key]: value
        });
    };

    const handleNewGameClick = () => {
        setInputHitValues(hits);
        setCondition(true);
    }

    const handleNumberPlayersChange = (value: string) => {
        setinputPlayersValue(value);
    }

    const handleCircleClick = (key: string, index: number, score: string) => {

        const updatedCircles = [...circles[score]];
        updatedCircles[index] = {
            ...updatedCircles[index],
            fill: updatedCircles[index].fill = '#ccc'
        };

        let currentHits = inputHitValues[key] || circles;
        currentHits[score] = updatedCircles;

        setInputHitValues({
            ...inputHitValues,
            [key]: currentHits
        });
    };

    return (
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

                    <div className='container'>
                        <div className='column killer-display input'>Cricket</div>
                        {scores.map((score, idx) => (
                            <div className='column killer-display' key={idx}>{score}</div>
                        ))}
                    </div>
                    {Object.entries(names).map(([key, value]) => (
                        <div className='container'>

                            <input
                                className='killer-display input'
                                type="text"
                                id={key}
                                value={inputNameValues[+key] || value}
                                onChange={(e) => handleNameChange(key, e.target.value)}
                                placeholder='Name...'
                            />
                            {Object.entries(inputHitValues).map(([key, circles]) => (
                                <div className='column killer-display'>
                                    {circles[20].map((circle, index) => (
                                        <svg width="40" height="40">
                                            <circle
                                                key={index}
                                                cx={circle.cx}
                                                cy={circle.cy}
                                                r={circle.r}
                                                fill={circle.fill}
                                                stroke={circle.stroke}
                                                strokeWidth="5"
                                                onMouseDown={() => handleCircleClick(key, index, '20')}
                                            />
                                        </svg>
                                    ))}
                                </div>
                            ))}


                        </div>
                    ))}


                </div>

            ))
}

export default Cricket;