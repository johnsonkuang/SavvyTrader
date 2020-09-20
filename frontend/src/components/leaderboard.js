import React, {Component } from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import StockGraph from "./StockGraph";
import Table from 'react-bootstrap/Table'


class Leaderboard extends Component {
  render(){
    return(
      <Container>
        <Row>
          <Col md={12}>
            <h1>Leaderboard</h1>
            <div>
              <Table striped bordered hover variant="dark">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Points</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>1</td>
                  <td>Vishal</td>
                  <td>99999</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Johnson</td>
                  <td>153</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Fred</td>
                  <td>1</td>
                </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}
export default Leaderboard;