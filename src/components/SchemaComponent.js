import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import MultiGraph from '../dataComponents/multiGraphComponents/MultiGraph'
import Container from 'react-bootstrap/Container'
import style from '../styles'

class SchemaComponent extends Component {
    constructor(props) {
        super(props)
        this.mainContainer = React.createRef()
    }
    render() {
        if (!this.props.showSchemaCategory) {
            return null
        } else {
            return <Row style={style.basicComponentsStyle}>
                <Container style={{ margin: "5px" }} fluid="true">
                    <Col style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px" }}>
                        <Row style={{ marginTop: '5px' }}>
                            <h4>Schema category of {this.props.dataSet.header}</h4>
                        </Row>
                        <Row ref={this.mainContainer} style={{ "margin": "10px" }}>
                            <MultiGraph key={this.props.dataSet.schemaKey} data={this.props.dataSet.schemaData} width={this.props.width} height={this.props.height} nodeName={"SchemaCategoryNodes"} linkName={"SchemaCategoryEdges"} nameClass={"SchemaCategoryClass"} editableGraph={false} showEdgeLabels = {true} />
                        </Row>
                    </Col>
                </Container>
                {/*<Row style={style.basicComponentsStyle}>
            <Col>
                <h4>Editable Graph Example</h4>
                <Graph key={this.props.schemaKey} id="1" data={this.props.schemaData} width={this.props.width} height={this.props.height} nodeName={"schemaNodes"} linkName={"schemaLinks"} nameClass={"schemaGraph"} editableGraph={true} />
            </Col>
    </Row>*/}
            </Row>
        }
    }
}
export default SchemaComponent