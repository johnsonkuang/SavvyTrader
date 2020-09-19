import React from 'react';

import './App.css';
import Main from './components/main';
import NavBar from './NavBar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  return (
    <div>
        <NavBar />
        <Main></Main>
        <FontAwesomeIcon icon="search" />
    </div>
  );
}

/*
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
*/

export default App;