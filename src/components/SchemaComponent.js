import React, { Component } from 'react'
import style from '../styles'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Graph from '../dataComponents/graphComponents/Graph'
import CategoryComponent from '../components/CategoryComponent'

class SchemaComponent extends Component {
    constructor(props) {
		super(props)
		this.state = {
            schemaVisible: false
        }
    }

    componentDidUpdate(prevState) {
        if(JSON.stringify(prevState.mlSchemaData) !== JSON.stringify(this.props.mlSchemaData)) {
                this.setState({
                    schemaVisible: true
                })
        }
    }

    render() {
      return <div> <Row style={style.basicComponentsStyle}>
            <Col>
                <h4>Abstract Categorical Schema</h4>
    { this.state.schemaVisible && <CategoryComponent width={this.props.width} height={this.props.height} mlSchemaData = {this.props.mlSchemaData} /> }
            </Col>
        </Row>
            <Row style={style.basicComponentsStyle}>
                <Col>
                    <h4>Editable Graph Example</h4>
                    <Graph key={this.props.schemaKey} id="1" data={this.props.schemaData} width={this.props.width} height={this.props.height} nodeName={"schemaNodes"} linkName={"schemaLinks"} nameClass={"schemaGraph"} editableGraph={true} />
                </Col>
            </Row>
        </div>
    }
}
export default SchemaComponent