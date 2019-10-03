import React, { Component } from 'react'
import style from '../styles'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import MultiGraph from '../dataComponents/multiGraphComponents/MultiGraph'
import data from '../exampleData/schema.json'
import Container from 'react-bootstrap/Container'

class SchemaComponent extends Component {
    constructor(props) {
        super(props)
        this.mainContainer = React.createRef()
    }

    componentDidMount () {
        console.log(this.mainContainer)
      }

    render() {
        return <Container style={{ margin: "5px" }} fluid="true">
            <Col style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px" }}>
                <Row style={{ marginTop: '5px' }}>
                    <h4>Schema Category</h4>
                </Row>
                <Row ref={this.mainContainer} style={{ "margin": "10px" }}>
                    <MultiGraph id={"SchemaCategoryKey"} data={data} width={this.props.width} height={this.props.height} nodeName={"SchemaCategoryNodes"} linkName={"SchemaCategoryEdges"} nameClass={"SchemaCategoryClass"} editableGraph={false} />
                </Row>
            </Col>
        </Container>
        /*<Row style={style.basicComponentsStyle}>
            <Col>
                <h4>Editable Graph Example</h4>
                <Graph key={this.props.schemaKey} id="1" data={this.props.schemaData} width={this.props.width} height={this.props.height} nodeName={"schemaNodes"} linkName={"schemaLinks"} nameClass={"schemaGraph"} editableGraph={true} />
            </Col>
</Row>*/
    }
}
export default SchemaComponent