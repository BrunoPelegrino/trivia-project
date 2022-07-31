import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Game from './pages/Game';
import Feedback from './pages/Feedback';
import Ranking from './pages/Ranking';
import './App.css';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" render={ (props) => <Login { ...props } /> } />
      <Route path="/settings" render={ (props) => <Settings { ...props } /> } />
      <Route path="/game" render={ (props) => <Game { ...props } /> } />
      <Route path="/feedback" render={ (props) => <Feedback { ...props } /> } />
      <Route path="/ranking" render={ (props) => <Ranking { ...props } /> } />
    </Switch>
  );
}
