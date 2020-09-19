import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './home';
import Leaderboard from "./leaderboard";
import Trades from "./trades";


const Main = () => (
  <Switch>
    <Route exact path = "/" component={Home}/>
    <Route path = "/leaderboard" component={Leaderboard}/>
    <Route path = "/trades" component={Trades}/>
  </Switch>
)

export default Main