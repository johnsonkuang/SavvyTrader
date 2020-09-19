import React from 'react';

import './App.css';
import {Layout, Header, Navigation, Drawer, Content} from 'react-mdl';
import {Link} from 'react-router-dom'
import Main from './components/main';
function App() {
  return (
    <div className="demo-big-content">
      <Layout>
        <Header
          className="header-color"
          title={
            <Link style={{ textDecoration: "none", color: "white" }} to="/">
              Savvy Trader
            </Link>
          }
          scroll
        >
          <Navigation>
            <Link to="/">Home</Link>
            <Link to="/trades">My Trades</Link>
            <Link to="/leaderboard">Leaderboard</Link>
          </Navigation>
        </Header>
        <Drawer title="Savvy Trader">
          <Navigation>
            <Link to="/">Home</Link>
            <Link to="/trades">My Trades</Link>
            <Link to="/leaderboard">Leaderboard</Link>
          </Navigation>
        </Drawer>
        <Content>
          <div className="page-content" />
          <Main/>
        </Content>
      </Layout>
    </div>
  );
}

export default App;