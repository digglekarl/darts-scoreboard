import React, { Component, useState } from 'react';
import './App.css';
import Killer from './game/killer/killer';
import Main from './game/pub-game/pub';
import RoundTheBoard from './game/roundtheboard/roundtheboard';
import Start from './game/start/start';
import Cricket from './game/cricket/cricket';

function App() {
  const [mode, setGameMode] = useState<GameMode>(0);

  const enum GameMode {
    Start,
    Darts,
    Killer,
    RoundTheBoard,
    Cricket
  }

  const handleGameClick = (mode: GameMode) => {
    setGameMode(mode);
  };

  function DartsComponent(){
    return (<Main />)
  }

  function KillerComponent(){
    return (<Killer />)
  }

  function RoundTheBoardComponent(){
    return (<RoundTheBoard />)
  }

  function CricketComponent(){
    return (<Cricket />)
  }

  const componentMap = {
    [GameMode.Start]: <Start />,
    [GameMode.Darts]: <DartsComponent />,
    [GameMode.Killer]: <KillerComponent />,
    [GameMode.RoundTheBoard]: <RoundTheBoardComponent />,
    [GameMode.Cricket]: <CricketComponent />
  };

  const ComponentToRender = componentMap[mode];

  return (
    <div className="App">
      <header className={mode === GameMode.Start ? "App-header" : 'hidden'}>
        <button onClick={() => handleGameClick(GameMode.Darts)}>Pub Darts</button>
        <button onClick={() => handleGameClick(GameMode.Killer)}>Killer</button>
        <button onClick={() => handleGameClick(GameMode.RoundTheBoard)}>Round The Board</button>
        <button onClick={() => handleGameClick(GameMode.Cricket)}>Cricket</button>
      </header>

      <div>
        {ComponentToRender}
      </div>
    </div>
  );
}

export default App;
