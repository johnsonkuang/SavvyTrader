import React, {Component } from 'react';
import Container from 'react-bootstrap/esm/Container';
import StockGraph from './StockGraph';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

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
            <h1>Search Bar for Stonks Here?</h1>
            <div>
              <StockGraph></StockGraph>
            </div>
          </Col>
          <Col md={4} className="right-column">
            <Row>
              <Col md={8}>
                <h2 className="user-points">Points:0</h2>
              </Col>
              <Col md={8}>
                <h2 class="user-energy">Energy:0</h2>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>
                  Compete against other traders in predicting the stock end price at the next hour, day, or week!
                </div>
                <Form>
                  <Form.Group controlId="formGuessStockPrice">
                    <Form.Label>Stock Price Prediction</Form.Label>
                    <Form.Control type="Stock Price" placeholder="Enter Stock Price" />
                  </Form.Group>
                  <Form.Group controlId="formEndTime">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control as="select">
                      <option>Next Hour</option>
                      <option>Next Day</option>
                      <option>Next Week</option>
                    </Form.Control>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>All User Predictions</h2>
                <div>
                  <Table striped bordered hover variant="dark">
                    <thead>
                    <tr>
                      <th>End Time</th>
                      <th>Average Predicted Stock Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>Next Hour</td>
                      <td>$56.24</td>
                    </tr>
                    <tr>
                      <td>Next Day</td>
                      <td>57.98</td>
                    </tr>
                    <tr>
                      <td>Next Week</td>
                      <td>$61.54</td>
                    </tr>
                    </tbody>
                  </Table>
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