import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

// Schemas for drawing D3 graphs:
import eCommerceSchema from '../schemaCategories/eCommerceSchema.json'
import patentSchema from '../schemaCategories/patentSchema.json'
import filmSchema from '../schemaCategories/filmSchema.json'
import universitySchema from '../schemaCategories/universitySchema.json'
import personSchema from '../schemaCategories/personSchema.json'
import unibenchSchema from '../schemaCategories/unibenchSchema.json'

//Query examples:
import eCommerceExamples from '../queryExamples/eCommerceDataExamples.json'
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
                    <h4>Select data set</h4>
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
                                onClick={this.props.handleDataSetChange.bind(this, { header: "E-commerce data set", examples: eCommerceExamples, schemaData: eCommerceSchema, metaData: uploadInfo["simpleDemoData"], nameForCategoricalQueryView: "simpleDemo" })}>
                                E-commerce data set
                            </Dropdown.Item>
                            <Dropdown.Item href="#/unibench"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Unibench data set", examples: unibenchExamples, schemaData: unibenchSchema, metaData: uploadInfo["unibench"], nameForCategoricalQueryView: "unibench" })}>
                                Unibench data set
                            </Dropdown.Item>
                            <Dropdown.Item href="#/patent"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Helsinki Multi-Model Repository: Patent data set", examples: patentDataExamples, schemaData: patentSchema, metaData: uploadInfo["patent"], nameForCategoricalQueryView: "patent" })}>
                                Patent data set
                            </Dropdown.Item>
                            <Dropdown.Item href="#/film"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Helsinki Multi-Model Repository: Film data set", examples: filmExamples, schemaData: filmSchema, metaData: uploadInfo["film"], nameForCategoricalQueryView: "film" })}>
                                Film data set
                            </Dropdown.Item>
                            <Dropdown.Item href="#/university"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Helsinki Multi-Model Repository: Universities data set", examples: universityExamples, schemaData: universitySchema, metaData: uploadInfo["university"], nameForCategoricalQueryView: "university" })}>
                                University data set
                            </Dropdown.Item>
                            <Dropdown.Item href="#/person"
                                onClick={this.props.handleDataSetChange.bind(this, { header: "Helsinki Multi-Model Repository: Persons data set", examples: personExamples, schemaData: personSchema, metaData: uploadInfo["person"], nameForCategoricalQueryView: "person" })}>
                                Person data set
                            </Dropdown.Item>
                        </DropdownButton>
                    </Dropdown>
                </Col>
            </Row>
        </Container>
    }
}

export default SelectDataSetComponent