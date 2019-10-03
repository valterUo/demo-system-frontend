import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown'
import examples from '../examples.json'
import patentDataExamples from '../PatentDataExamples.json'

class SelectDataSetComponent extends Component {

    render() {
        return <Container style={{ margin: "5px" }} fluid="true">
            <Row style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px" }}>
                <Col xl={1}>
                    <Row style={{ marginTop: '5px' }}>
                        <h4>Select model</h4>
                    </Row>
                </Col>
                <Row style={{ "margin": "10px" }}>
                    <Dropdown>
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                            Datasets
                    </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1" onClick={this.props.handleDataSetChange.bind(this, {header: "Simple demo dataset", examples: examples})}>Simple demo dataset</Dropdown.Item>
                            <Dropdown.Item href="#/action-2" onClick={this.props.handleDataSetChange.bind(this, {header: "UDMS Dataset Patent data examples (contain bugs)", examples: patentDataExamples})}>UDMS Patent Dataset</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">UDMS Film Dataset</Dropdown.Item>
                            <Dropdown.Item href="#/action-4">UDMS University Dataset</Dropdown.Item>
                            <Dropdown.Item href="#/action-5">UDMS Person Dataset</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Row>
            </Row>
        </Container>
    }
}

export default SelectDataSetComponent