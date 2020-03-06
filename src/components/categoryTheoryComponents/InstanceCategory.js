import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import MultiGraph from '../../dataComponents/multiGraphComponents/MultiGraph'
import Container from 'react-bootstrap/Container'
import style from '../../styles'

class InstanceCategory extends Component {
    constructor(props) {
        super(props)
        this.mainContainer = React.createRef()
    }
    render() {
        if (!this.props.showInstanceCategory) {
            return null
        }
        return <Row style={style.basicComponentsStyle}>
            <Container style={{ margin: "5px" }} fluid="true">
                <Col style={style.commonCol}>
                    <Row style={{ marginTop: '5px' }}>
                        <h4>Instance category of {this.props.dataSet.header}</h4>
                    </Row>
                    <Row ref={this.mainContainer} style={{ "margin": "10px" }}>
                        <MultiGraph key={this.props.dataSet.instanceKey} data={this.props.dataSet.instanceData} width={this.props.width} height={this.props.height}
                            nodeName={"InstanceCategoryNodes"} linkName={"InstanceCategoryEdges"} nameClass={"InstanceCategoryClass"} editableGraph={false} showEdgeLabels={true} />
                    </Row>
                </Col>
            </Container>
        </Row>

    }
}
export default InstanceCategory