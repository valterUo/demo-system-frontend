import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Col from 'react-bootstrap/Col'

class ResultNavigationSidePanel extends Component {

    render() {
        return <Container>
            <Navbar>
                <Col>
                    <Card >
                        <Card.Header style={{ backgroundColor: "#BDF2FF" }}>
                            <Row style = {{margin: "5px"}}>
                                <h4>Result</h4>
                            </Row>
                        </Card.Header>
                    </Card>
                    <Nav.Item>
                        <Card >
                            <Card.Header>
                                <Button style={{ width: "192px" }} type="button" variant="dark" onClick={this.props.toggleResult}>Result</Button>
                                <i className="fa fa-info-circle" style={{ fontSize: "20px", float: "right" }} aria-hidden="true" onClick={() => this.props.togglePopup("result")}></i>
                            </Card.Header>
                        </Card>
                    </Nav.Item>
                    <Nav.Item >
                        <Card >
                            <Card.Header>
                                <Button type="button" variant="dark" onClick={this.props.toggleCategoricalView}>Categorical view of query </Button>
                                <i className="fa fa-info-circle" style={{ fontSize: "20px", float: "right" }} aria-hidden="true" onClick={() => this.props.togglePopup("categoricalViewToQuery")}></i>
                            </Card.Header>
                        </Card>
                    </Nav.Item>
                </Col>
            </Navbar>
        </Container>
    }
}

export default ResultNavigationSidePanel