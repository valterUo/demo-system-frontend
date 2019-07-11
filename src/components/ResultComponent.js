import React, { Component } from 'react'
import style from '../styles'
//import Tabs from 'react-bootstrap/Tabs'
//import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import RelationalTabs from '../dataComponents/relationalComponents/relationalTabs'
//import Tree from '../dataComponents/treeComponents/Tree'
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

        /*<Row style={style.basicComponentsStyle}>
            <Col>
                <h4>Result:</h4>
                {this.props.queryResultData !== undefined &&
                    <Graph key={this.props.resultKey} data={this.props.queryResultData} width={this.props.width} height={this.props.height} nodeName={this.props.nodeName + 'Graph'} linkName={this.props.linkName + 'Graph'}
                        nameClass={this.props.nameClass + 'Graph'} editableGraph={false} />
                }
                {(this.props.sqlData !== undefined && this.props.documentData !== undefined && this.props.graphData !== undefined) &&
                <Tabs defaultActiveKey="rel" id="uncontrolled-tab-example">
                    <Tab eventKey="rel" title="Relational output">
                        <RelationalTabs width = {this.props.width} height = {this.props.height} key={this.props.relationalKey} tables={this.props.sqlData} />
                    </Tab>
                    <Tab eventKey="tree" title="XML output">
                        <Tree key={this.props.treeKey} data={this.props.documentData} width={this.props.width} height={this.props.height} nodeName={this.props.nodeName + 'Tree'} linkName={this.props.linkName + 'Tree'} nameClass={this.props.nameClass + 'Tree'} />
                    </Tab>
                    <Tab eventKey="graph" title="Graph output">
                        <Graph key={this.props.resultKey} data={this.props.graphData} width={this.props.width} height={this.props.height} nodeName={this.props.nodeName + 'Graph'} linkName={this.props.linkName + 'Graph'} 
                        nameClass={this.props.nameClass + 'Graph'} editableGraph={false} />
                    </Tab>
                </Tabs>
            }
            </Col>
        </Row>*/
    }
}
export default ResultComponent