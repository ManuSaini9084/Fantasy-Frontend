//App.js

import React from 'react';
import Matches from './Matches';
import Teams from './Teams';
import Players from './Players';
import './App.css';
import TeamCreation from './TeamCreation';

const App = () => {
    return (
        <div className="container">
            <div className="header">
                <h1>Fantasy Sports App</h1>
            </div>
            <div className="content">
                <div className="matches">
                    <Matches />
                </div>
                <div className="teams">
                    <Teams />
                </div>
                <div className="players">
                    <Players />
                </div>
                <div className="tea">
                    <TeamCreation />
                </div>
            </div>
        </div>
    );
};

export default App;
