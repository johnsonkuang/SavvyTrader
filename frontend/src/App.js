import React, { Component } from 'react';

import Main from './components/main';
import NavBar from './NavBar';

class App extends Component {  
  constructor(props){
    super(props);
    this.state = {
      stockName : "AAPL",
      value: "",
      period: "year"
    }
  }

  render (){
    return(
    <div>
        <NavBar 
          handleSearch = {this.handleSearch}
          handleChange = {this.handleChange}
        />
        <Main stockName={this.state.stockName} ></Main>        
    </div>);
  }

  handleSearch = (event) => {
    this.setState((prevState) => ({
        stockName: prevState.value
    }));    
    console.log(this.state.stockName);  
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
    console.log(this.state.value);
  }
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