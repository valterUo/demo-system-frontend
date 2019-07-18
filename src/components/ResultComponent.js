import React, { Component } from 'react'
import style from '../styles'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import RelationalTabs from '../dataComponents/relationalComponents/relationalTabs'
import Graph from '../dataComponents/graphComponents/Graph'

class ResultComponent extends Component {

    render() {
        let renderedElement = null
        if (this.props.relationalResult !== undefined || this.props.graphResult !== undefined) {
            if (this.props.queryResultModel === "table") {
                renderedElement = <RelationalTabs width={this.props.width} height={this.props.height} key={this.props.relationalKey} tables={this.props.relationalResult} />
            } else if (this.props.queryResultModel === "graph") {
                renderedElement = <Graph key={this.props.graphKey} data={this.props.graphResult} width={this.props.width} height={this.props.height} nodeName={'GraphNodes'} linkName={'GraphLinks'}
                    nameClass={'GraphClassName'} editableGraph={false} />
            }
        }
        return <Row style={style.basicComponentsStyle}>
            <Col>
                <h4>Result:</h4>
                {renderedElement}
            </Col>
        </Row>
    }
}
export default ResultComponent