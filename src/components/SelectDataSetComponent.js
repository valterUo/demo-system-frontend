import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown'
import examples from '../examples.json'
import patentDataExamples from '../PatentDataExamples.json'
import simpleSchemaData from '../exampleData/simpleSchema.json'
import patentSchema from '../exampleData/patentSchema.json'

class SelectDataSetComponent extends Component {

    render() {
        return <Container style={{ margin: "5px" }} fluid="true">
            <Row>
                    <Col>
                        <h4>Select dataset</h4>
                    </Col>
                <Col>
                    <Dropdown style = {{left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 10000}}>
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                            Datasets
                    </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/simple" onClick={this.props.handleDataSetChange.bind(this, {header: "Simple demo dataset", examples: examples, schemaData: simpleSchemaData})}>Simple demo dataset</Dropdown.Item>
                            <Dropdown.Item href="#/patent" onClick={this.props.handleDataSetChange.bind(this, {header: "UDMS Dataset Patent data examples (contain bugs)", examples: patentDataExamples, schemaData: patentSchema})}>UDMS Patent Dataset</Dropdown.Item>
                            <Dropdown.Item href="#/film">UDMS Film Dataset</Dropdown.Item>
                            <Dropdown.Item href="#/university">UDMS University Dataset</Dropdown.Item>
                            <Dropdown.Item href="#/person">UDMS Person Dataset</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
        </Container>
    }
}

export default SelectDataSetComponent