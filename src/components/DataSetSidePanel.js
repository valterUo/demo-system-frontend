import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import style from '../styles'
import Container from 'react-bootstrap/Container'
import ExampleQueryComponent from './ExampleQueryComponent'
//import DataUploadComponent from './DataUploadComponent'
import Accordion from 'react-bootstrap/Accordion'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Col from 'react-bootstrap/Col'

function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionToggle(eventKey)
    return (
        <Button  style = {{ width: "138px" }} type="button" variant="dark" onClick={decoratedOnClick}>
            {children}
        </Button>
    )
}

class DataSetSidePanel extends Component {

    render() {
        return <Container>
            <Navbar>
                <Col>
                    <Card >
                        <Card.Header style={{ backgroundColor: "#BDF2FF" }}>
                            <Row style = {{margin: "5px"}}>
                                <h4>Selected dataset: {this.props.dataSet.header}</h4>
                            </Row>
                        </Card.Header>
                    </Card>
                    <Accordion>
                        {/*<Card >
                            <Card.Header>
                                <CustomToggle eventKey="e0">Upload data</CustomToggle>
                                <i className="fa fa-info-circle" style={{ fontSize: "20px", float: "right" }} aria-hidden="true" onClick={() => this.props.togglePopup("uploadData")}></i>
                            </Card.Header>
                        </Card>
                        <Accordion.Collapse eventKey="e0">
                            <Row style={style.basicComponentsStyle}>
                                <DataUploadComponent uploadInfo = {this.props.dataSet.metaData} />
                            </Row>
                        </Accordion.Collapse>*/}
                        <Card >
                            <Card.Header>
                                <CustomToggle eventKey="e1">Examples</CustomToggle>
                                <i className="fa fa-info-circle" style={{ fontSize: "20px", float: "right" }} aria-hidden="true" onClick={() => this.props.togglePopup("examples")}></i>
                            </Card.Header>
                        </Card>
                        <Accordion.Collapse eventKey="e1">
                            <Row style={style.basicComponentsStyle}>
                                <ExampleQueryComponent header={this.props.dataSet.header} examples={this.props.dataSet.examples} handleExampleQuery={this.props.handleExampleQuery} />
                            </Row>
                        </Accordion.Collapse>
                    </Accordion>
                    <Nav.Item>
                        <Card >
                            <Card.Header>
                                <Button type="button" variant="dark" onClick={this.props.toggleSchemaCategory}>Schema category</Button>
                                <i className="fa fa-info-circle" style={{ fontSize: "20px", float: "right" }} aria-hidden="true" onClick={() => this.props.togglePopup("schemaCategory")}></i>
                            </Card.Header>
                        </Card>
                    </Nav.Item>
                    <Nav.Item>
                        <Card >
                            <Card.Header>
                                <Button type="button" variant="dark" onClick={this.props.toggleInstanceCategory}>Instance category</Button>
                                <i className="fa fa-info-circle" style={{ fontSize: "20px", float: "right" }} aria-hidden="true" onClick={() => this.props.togglePopup("instanceCategory")}></i>
                            </Card.Header>
                        </Card>
                    </Nav.Item>
                </Col>
            </Navbar>
        </Container>
    }
}

export default DataSetSidePanel