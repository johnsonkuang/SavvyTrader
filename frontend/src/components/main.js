import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './home';
import Leaderboard from "./leaderboard";
import Trades from "./trades";


const Main = () => (
  <Switch>
    <Route exact path = "/" render={(props)=>(
      <Home {...props} />
    )}/>
    <Route path = "/leaderboard" render={(props)=>(
      <Leaderboard {...props} />
    )}/>
    <Route path = "/trades" render={(props)=>(
      <Trades {...props} />
    )}/>
  </Switch>
)

export default Main