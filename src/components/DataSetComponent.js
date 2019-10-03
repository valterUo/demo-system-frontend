import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import style from '../styles'
import Container from 'react-bootstrap/Container'
import ExampleQueryComponent from './ExampleQueryComponent'
import SchemaComponent from './SchemaComponent'
import DataUploadComponent from './DataUploadComponent'

class DataSetComponent extends Component {

    render() {
        return <Container style={{ margin: "5px" }} fluid="true">
            <Row style={style.basicComponentsStyle}>
                <DataUploadComponent />
            </Row>
            <Row style={style.basicComponentsStyle}>
                <ExampleQueryComponent header={this.props.dataSet.header} examples={this.props.dataSet.examples} handleExampleQuery={this.props.handleExampleQuery} />
            </Row>
            <Row style={style.basicComponentsStyle}>
                <SchemaComponent width={this.props.width} height={this.props.height} />
            </Row>
        </Container>
    }
}

export default DataSetComponent