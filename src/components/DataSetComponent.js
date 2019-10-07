import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import style from '../styles'
import Container from 'react-bootstrap/Container'
import ExampleQueryComponent from './ExampleQueryComponent'
import SchemaComponent from './SchemaComponent'
import DataUploadComponent from './DataUploadComponent'
import Accordion from 'react-bootstrap/Accordion'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionToggle(eventKey)
    return (
        <Button type="button" variant="dark" onClick={decoratedOnClick}>
            {children}
        </Button>
    )
}

class DataSetComponent extends Component {

    render() {
        return <Container style={{ margin: "5px" }} fluid="true">
            <Accordion defaultActiveKey="e0">
                <Card >
                    <Card.Header>
                        <CustomToggle eventKey="e0">Upload data</CustomToggle>
                    </Card.Header>
                </Card>
                <Accordion.Collapse eventKey="e0">
                    <Row style={style.basicComponentsStyle}>
                        <DataUploadComponent />
                    </Row>
                </Accordion.Collapse>
                <Card >
                    <Card.Header>
                        <CustomToggle eventKey="e1">Examples</CustomToggle>
                    </Card.Header>
                </Card>
                <Accordion.Collapse eventKey="e1">
                    <Row style={style.basicComponentsStyle}>
                        <ExampleQueryComponent header={this.props.dataSet.header} examples={this.props.dataSet.examples} handleExampleQuery={this.props.handleExampleQuery} />
                    </Row>
                </Accordion.Collapse>
                <Card >
                    <Card.Header>
                        <CustomToggle eventKey="e2">Schema category</CustomToggle>
                    </Card.Header>
                </Card>
                <Accordion.Collapse eventKey="e2">
                    <Row style={style.basicComponentsStyle}>
                        <SchemaComponent width={this.props.width} height={this.props.height} schemaData={this.props.dataSet.schemaData} header={this.props.dataSet.header} schemaKey={this.props.dataSet.schemaKey} />
                    </Row>
                </Accordion.Collapse>
            </Accordion>
        </Container>
    }
}

export default DataSetComponent