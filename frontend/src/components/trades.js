import React, {Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'



class Trades extends Component {
  render(){
    return(
      <Container>
        <Row>
          <Col md={12}>
            <h1>My Trades</h1>
            <div>
              <Table striped bordered hover variant="dark">
                <thead>
                <tr>
                  <th>Company</th>
                  <th>Current Price</th>
                  <th>Predicted Price</th>
                  <th>Time Predicted</th>
                  <th>Prediction Type</th>
                  <th>Prediction End Time</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>AAPL</td>
                  <td>$1</td>
                  <td>$2</td>
                  <td>IDK</td>
                  <td>Hour</td>
                  <td>IDK</td>
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

export default Trades;