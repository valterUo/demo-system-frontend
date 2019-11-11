import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown'

// Schemas for drawing D3 graphs:
import simpleSchemaData from '../schemasForD3/simpleSchema.json'
import patentSchema from '../schemasForD3/patentSchema.json'
import filmSchema from '../schemasForD3/filmSchema.json'
import universitySchema from '../schemasForD3/universitySchema.json'
import personSchema from '../schemasForD3/personSchema.json'

//Query examples:
import simpleExamples from '../queryExamples/simpleDemoDataExamples.json'
import patentDataExamples from '../queryExamples/patentDataExamples.json'
import filmExamples from '../queryExamples/filmDataExamples.json'
import universityExamples from '../queryExamples/universityDataExamples.json'
import personExamples from '../queryExamples/personDataExamples.json'
import uploadInfo from '../dataUploadInfo/uploadInfo.json'

class SelectDataSetComponent extends Component {

    render() {
        return <Container style={{ margin: "5px" }} fluid="true">
            <Row>
                <Col xl={6}>
                    <h4>Select dataset</h4>
                </Col>
                <Col xl={6}>
                    <Dropdown style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 10000 }}>
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                            Datasets
                    </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/simple"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Customer-Orders-Locations Dataset", examples: simpleExamples, schemaData: simpleSchemaData, metaData: uploadInfo["simpleDemoData"] })}>
                                Customer-Orders-Locations Dataset
                            </Dropdown.Item>
                            <Dropdown.Item href="#/patent"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Helsinki Multi-Model Repository: Patent Dataset (contains bugs)", examples: patentDataExamples, schemaData: patentSchema, metaData: uploadInfo["patent"] })}>
                                Patent Dataset
                            </Dropdown.Item>
                            <Dropdown.Item href="#/film"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Helsinki Multi-Model Repository: Film Dataset (contain bugs)", examples: filmExamples, schemaData: filmSchema, metaData: uploadInfo["film"] })}>
                                Film Dataset
                            </Dropdown.Item>
                            <Dropdown.Item href="#/unibench"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Unibench Dataset", examples: filmExamples, schemaData: filmSchema, metaData: uploadInfo["unibench"] })}>
                                Unibench Dataset
                            </Dropdown.Item>
                            <Dropdown.Item href="#/university"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Helsinki Multi-Model Repository: Universities Dataset (contain bugs)", examples: universityExamples, schemaData: universitySchema, metaData: uploadInfo["university"] })}>
                                University Dataset
                            </Dropdown.Item>
                            <Dropdown.Item href="#/person"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Helsinki Multi-Model Repository: Persons Dataset (contain bugs)", examples: personExamples, schemaData: personSchema, metaData: uploadInfo["person"] })}>
                                Person Dataset
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
        </Container>
    }
}

export default SelectDataSetComponent