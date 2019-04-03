import React, { Component } from 'react'
import style from './styles'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Graph from './dataComponents/graphComponents/Graph'
import MultiGraph from './dataComponents/multiGraphComponents/MultiGraph'
import schema from './exampleData/schema.json'

class SchemaComponent extends Component {

    render() {
        return <div> <Row style={style.basicComponentsStyle}>
            <Col>
                <h4>Schema</h4>
                <Graph key={this.props.schemaKey} id="1" data={this.props.schemaData} width={930} height={500} nodeName={"schemaNodes"} linkName={"schemaLinks"} nameClass={"schemaGraph"} editableGraph={true} />
            </Col>
        </Row>
            <Row style={style.basicComponentsStyle}>
                <Col>
                    <h4>Query schema</h4>
                    <MultiGraph id="2" data={schema} width={930} height={500} nodeName={"queryNodes"} linkName={"queryLinks"} nameClass={"queryGraph"} editableGraph={false} />
                </Col>
            </Row>
        </div>
    }
}
export default SchemaComponent