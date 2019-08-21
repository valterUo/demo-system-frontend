import React, { Component } from 'react'
import style from '../styles'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import MultiGraph from '../dataComponents/multiGraphComponents/MultiGraph'
import data from '../exampleData/schema.json'

class SchemaComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            schemaVisible: false
        }
    }

    render() {
        return <div> <Row style={style.basicComponentsStyle}>
            <Col>
                <h4>Schema Category</h4>
                <MultiGraph id={"SchemaCategoryKey"} data={data} width={this.props.width} height={this.props.height} nodeName={"SchemaCategoryNodes"} linkName={"SchemaCategoryEdges"} nameClass={"SchemaCategoryClass"} editableGraph={false} />
            </Col>
        </Row>
            {/*<Row style={style.basicComponentsStyle}>
                <Col>
                    <h4>Editable Graph Example</h4>
                    <Graph key={this.props.schemaKey} id="1" data={this.props.schemaData} width={this.props.width} height={this.props.height} nodeName={"schemaNodes"} linkName={"schemaLinks"} nameClass={"schemaGraph"} editableGraph={true} />
                </Col>
    </Row>*/}
        </div>
    }
}
export default SchemaComponent