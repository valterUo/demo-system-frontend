import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Col from 'react-bootstrap/Col'
import Accordion from 'react-bootstrap/Accordion'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle'
import style from '../styles'

function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionToggle(eventKey)
    return (
        <Button style={{ width: "138px" }} type="button" variant="dark" onClick={decoratedOnClick}>
            {children}
        </Button>
    )
}

class ResultNavigationSidePanel extends Component {

    render() {
        let infoBlock = []
        if (this.props.resultSet.model === "algebraic graph") {
            infoBlock = this.props.resultSet.resultData.nodes.map((l, i) => {
                let info = []
                for (var key of Object.keys(l)) {
                    if (key === "index") {
                        break
                    }
                    info.push(<div key={l[key] + i + Math.random()}><b>{key}</b>:{l[key]}</div>)
                }
                return info
            })
        }
        return <Container>
            <Navbar>
                <Col>
                    <Card >
                        <Card.Header style={{ backgroundColor: "#BDF2FF" }}>
                            <Row style={{ margin: "5px" }}>
                                <h4>Result</h4>
                            </Row>
                        </Card.Header>
                    </Card>
                    <Nav.Item>
                        <Card >
                            <Card.Header>
                                <Button style={{ width: "138px" }} type="button" variant="dark" onClick={this.props.toggleResult}>Result</Button>
                                <i className="fa fa-info-circle" style={{ fontSize: "20px", float: "right" }} aria-hidden="true" onClick={() => this.props.togglePopup("result")}></i>
                            </Card.Header>
                        </Card>
                    </Nav.Item>
                    <Nav.Item >
                        <Card >
                            <Card.Header>
                                <Button style={{ width: "138px" }} type="button" variant="dark" onClick={this.props.toggleCategoricalView}>Categorical view of query </Button>
                                <i className="fa fa-info-circle" style={{ fontSize: "20px", float: "right" }} aria-hidden="true" onClick={() => this.props.togglePopup("categoricalViewToQuery")}></i>
                            </Card.Header>
                        </Card>
                    </Nav.Item>
                    <Nav.Item hidden={!(this.props.resultSet.model === "algebraic graph")} >
                        <Accordion>
                            <Card >
                                <Card.Header>
                                    <CustomToggle eventKey="e4">Nodes</CustomToggle>
                                </Card.Header>
                            </Card>
                            <Accordion.Collapse eventKey="e4">
                                <Row style={style.basicComponentsStyle}>
                                    <Col>
                                        <h4>Nodes:</h4>
                                        <div>{infoBlock.map((l, i) => <div key={"list" + i}><h6>Node: </h6>{l}</div>)}</div>
                                    </Col>
                                </Row>
                            </Accordion.Collapse>
                        </Accordion>
                    </Nav.Item>
                </Col>
            </Navbar>
        </Container>
    }
}

export default ResultNavigationSidePanel