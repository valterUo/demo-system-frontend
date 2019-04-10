import React, { Component } from 'react'
import style from '../styles'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Graph from '../dataComponents/graphComponents/Graph'
import CategoryComponent from '../components/CategoryComponent'

class SchemaComponent extends Component {

    render() {
       return <div> <Row style={style.basicComponentsStyle}>
            <Col>
                <h4>Abstract Categorical Schema</h4>
                <CategoryComponent width={this.props.width} height={this.props.height} source = {this.props.sourceFunction} target = {this.props.targetFunction} />
            </Col>
        </Row>
            <Row style={style.basicComponentsStyle}>
                <Col>
                    <h4>Instance of Schema</h4>
                    <Graph key={this.props.schemaKey} id="1" data={this.props.schemaData} width={this.props.width} height={this.props.height} nodeName={"schemaNodes"} linkName={"schemaLinks"} nameClass={"schemaGraph"} editableGraph={true} />
                </Col>
            </Row>
        </div>
    }
}
export default SchemaComponent