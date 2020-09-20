import React, {Component } from 'react';
import Container from 'react-bootstrap/esm/Container';
import StockGraph from './StockGraph';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import axios from "axios";

class Home extends Component {
  constructor(props){
    super(props);
    console.log("INSIDE HOME");
    this.state = {
      points: 0,
      energy: 100
    }
  }
  componentDidMount(){
    console.log("INSIDE COMPONENT DID MOUNT HOME");
    this.getUserInfo().then((data) =>
      {
        this.setState({
          points : data["points"],
          energy : data["energy"]
        })}
    );
  }
  async getUserInfo(){
    console.log("INSIDE GET USER INFO");
    try {
      const response = await axios.get('http://localhost:8080/getUserInfo?user=vishal');
      const data = response.data;
      console.log("user data");
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  render(){
    return(
      // <Container>
      //   <div>Home</div>
      //   <StockGraph></StockGraph>
      // </Container>
      <Container>
        <h1>{this.props.stockName}</h1>
        <Row>
          <Col md={8}>            
            <div>
              <StockGraph 
                stockName={this.props.stockName}
                period={"month"}
              />
            </div>
          </Col>
          <Col md={4} className="right-column">
            <Row>
              <Col md={4}>
                <p className="user-points"> Points: {this.state.points}</p>
              </Col>
              <Col md={8}>
                <p class="user-energy"> Energy: {this.state.energy}</p>
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