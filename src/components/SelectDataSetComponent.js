import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

// Schemas for drawing D3 graphs:
import simpleSchemaData from '../schemasForD3/simpleSchema.json'
import patentSchema from '../schemasForD3/patentSchema.json'
import filmSchema from '../schemasForD3/filmSchema.json'
import universitySchema from '../schemasForD3/universitySchema.json'
import personSchema from '../schemasForD3/personSchema.json'
import unibenchSchema from '../schemasForD3/unibenchSchema.json'

//Query examples:
import simpleExamples from '../queryExamples/simpleDemoDataExamples.json'
import patentDataExamples from '../queryExamples/patentDataExamples.json'
import filmExamples from '../queryExamples/filmDataExamples.json'
import universityExamples from '../queryExamples/universityDataExamples.json'
import personExamples from '../queryExamples/personDataExamples.json'
import unibenchExamples from "../queryExamples/unibenchExamples.json"

import uploadInfo from '../dataUploadInfo/uploadInfo.json'

class SelectDataSetComponent extends Component {

    render() {
        return <Container style={{ margin: "5px" }} fluid="true">
            <Row>
                <Col xl={6}>
                    <h4>Select dataset</h4>
                </Col>
                <Col xl={6}>
                    <Dropdown style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 10000, right: "0px" }}>
                        <DropdownButton
                                drop={"left"}
                                variant="dark"
                                title={"Datasets"}
                                id={'dropdown-button-drop-left'}
                                key={"left"}>
                            <Dropdown.Item href="#/simple"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Customer-Orders-Locations", examples: simpleExamples, schemaData: simpleSchemaData, metaData: uploadInfo["simpleDemoData"], nameForCategoricalQueryView: "simpleDemo" })}>
                                Customer-Orders-Locations dataset
                            </Dropdown.Item>
                            <Dropdown.Item href="#/unibench"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Unibench dataset", examples: unibenchExamples, schemaData: unibenchSchema, metaData: uploadInfo["unibench"], nameForCategoricalQueryView: "unibench" })}>
                                Unibench dataset
                            </Dropdown.Item>
                            <Dropdown.Item href="#/patent"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Helsinki Multi-Model Repository: Patent dataset", examples: patentDataExamples, schemaData: patentSchema, metaData: uploadInfo["patent"], nameForCategoricalQueryView: "patent" })}>
                                Patent dataset
                            </Dropdown.Item>
                            <Dropdown.Item href="#/film"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Helsinki Multi-Model Repository: Film dataset", examples: filmExamples, schemaData: filmSchema, metaData: uploadInfo["film"], nameForCategoricalQueryView: "film" })}>
                                Film dataset
                            </Dropdown.Item>
                            <Dropdown.Item href="#/university"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Helsinki Multi-Model Repository: Universities dataset", examples: universityExamples, schemaData: universitySchema, metaData: uploadInfo["university"], nameForCategoricalQueryView: "university" })}>
                                University dataset
                            </Dropdown.Item>
                            <Dropdown.Item href="#/person"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Helsinki Multi-Model Repository: Persons dataset", examples: personExamples, schemaData: personSchema, metaData: uploadInfo["person"], nameForCategoricalQueryView: "person" })}>
                                Person dataset
                            </Dropdown.Item>
                        </DropdownButton>
                    </Dropdown>
                </Col>
            </Row>
        </Container>
    }
}

export default SelectDataSetComponent