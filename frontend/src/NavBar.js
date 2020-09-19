import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {FiSearch} from 'react-icons/fi';
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

//Stateless Functional Component
/**
 * Purely cosmetic navbar that uses <Link> to route between app components
 */
class NavBar extends Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Row>
                        <Col md="auto"><Navbar.Brand>SavvyTrader</Navbar.Brand></Col>
                        <Nav className="mr-auto">
                            <Col md="auto">
                                <Nav.Link href="/">
                                    Home
                                </Nav.Link>
                            </Col>                            
                            <Col md="auto">
                                <Nav.Link href="/trades">
                                    My Trades
                                </Nav.Link>
                            </Col>  
                            <Col md="auto">
                                <Nav.Link href="/leaderboard">
                                    Leaderboard
                                </Nav.Link>
                            </Col>  
                        </Nav>                            
                    </Row>        
                    <Form>
                            <InputGroup>
                                <InputGroup.Prepend style={{height: "30px"}}>
                                    <InputGroup.Text style={{backgroundColor: "rgba(0,0,0,0)", borderRight: "none", paddingRight: "0px"}}>
                                        <FiSearch />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control 
                                    class="search"
                                    type="text"
                                    placeholder="Search"
                                    style={{height: "30px", width: "250px", backgroundColor : "rgba(0,0,0,0)", borderLeft: "none", fontSize: "10px"}}                                    
                                />
                            </InputGroup>
                    </Form>
                </Container>                        
            </Navbar>
        );        
    }
}

export default NavBar;
