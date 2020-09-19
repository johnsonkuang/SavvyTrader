import React, {Component } from 'react';
import Container from 'react-bootstrap/esm/Container';
import StockGraph from './StockGraph';


class Home extends Component {
  render(){
    return(
      <Container>
        <div>Home</div>
        <StockGraph></StockGraph>
      </Container>
    )
  }
}

export default Home;