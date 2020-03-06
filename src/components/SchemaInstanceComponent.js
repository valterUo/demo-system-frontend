import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import style from '../styles'
import SchemaCategory from './categoryTheoryComponents/SchemaCategory'
import InstanceCategory from './categoryTheoryComponents/InstanceCategory'

class SchemaInstanceComponent extends Component {

    render() {
        if(!this.props.showInstanceCategory && !this.props.showSchemaCategory) {
            return null
        }
        return <Row style={style.basicComponentsStyle}>
            <Container style={{ margin: "5px" }} fluid="true">
                <SchemaCategory dataSet={this.props.dataSet} width={this.props.width} height={this.props.height} showSchemaCategory={this.props.showSchemaCategory} />
                <InstanceCategory dataSet={this.props.dataSet} width={this.props.width} height={this.props.height} showInstanceCategory={this.props.showInstanceCategory} />
            </Container>
        </Row>
    }
}
export default SchemaInstanceComponent