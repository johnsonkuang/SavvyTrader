import React, {Component } from 'react';
import Container from 'react-bootstrap/esm/Container';
import StockGraph from './StockGraph';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


class Home extends Component {
  render(){
    return(
      // <Container>
      //   <div>Home</div>
      //   <StockGraph></StockGraph>
      // </Container>
      <Container>
        <Row>
          <Col md={8}>
            <h1>Home</h1>
            <div>
              <StockGraph></StockGraph>
            </div>
          </Col>
          <Col md={4}>
            <Row>
              <Col>
                <h2>User Prediction</h2>
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>All User Predictions</h2>
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Home;