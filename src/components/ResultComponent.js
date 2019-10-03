import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import RelationalTabs from '../dataComponents/relationalComponents/relationalTabs'
import Graph from '../dataComponents/graphComponents/Graph'
import NewTree from '../dataComponents/newTreeComponents/newTree'
import Col from 'react-bootstrap/Col'

class ResultComponent extends Component {

    render() {
        let renderedElement = null

        if (this.props.queryResultModel === "relational" && this.props.relationalResult !== undefined) {
            renderedElement = <RelationalTabs width={this.props.width} height={this.props.height} key={this.props.relationalKey} tables={this.props.relationalResult} />
        } else if (this.props.queryResultModel === "graph" && this.props.graphResult !== undefined) {
            renderedElement = <Graph key={this.props.graphKey} data={this.props.graphResult} width={this.props.width} height={this.props.height} nodeName={'GraphNodes'} linkName={'GraphLinks'}
                nameClass={'GraphClassName'} editableGraph={false} />
        } else if (this.props.queryResultModel === "tree" && this.props.treeResult !== undefined) {
            renderedElement = <NewTree treeResult={this.props.treeResult} width={this.props.width} height={this.props.height} />
        }

        return <Container style={{ margin: "5px" }} fluid="true">
            <Col style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px" }}>
                <Row style={{ marginTop: '5px' }}>
                    <h4>Result</h4>
                </Row>
                <Row style={{ "margin": "10px" }}>
                    {renderedElement}
                </Row>
            </Col>
        </Container>
    }
}
export default ResultComponent