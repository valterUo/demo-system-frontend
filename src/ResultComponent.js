import React, { Component } from 'react'
import style from './styles'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import RelationalTabs from './dataComponents/relationalComponents/relationalTabs'
import Tree from './dataComponents/treeComponents/Tree'
import Graph from './dataComponents/graphComponents/Graph'

class ResultComponent extends Component {

    render() {
        return <Row style={style.basicComponentsStyle}>
        <Col>
            <h4>Result:</h4>
            {(this.props.sqlData !== undefined && this.props.documentData !== undefined && this.props.graphData !== undefined) &&
                <Tabs defaultActiveKey="rel" id="uncontrolled-tab-example">
                    <Tab eventKey="rel" title="Relational output">
                        <RelationalTabs key={this.props.relationalKey} tables={this.props.sqlData} />
                    </Tab>
                    <Tab eventKey="tree" title="XML output">
                        <Tree key={this.props.treeKey} data={this.props.documentData} width={500} height={500} nodeName={this.props.nodeName + 'Tree'} linkName={this.props.linkName + 'Tree'} nameClass={this.props.nameClass + 'Tree'} />
                    </Tab>
                    <Tab eventKey="graph" title="Graph output">
                        <Graph key={this.props.graphKey} data={this.props.graphData} width={500} height={500} nodeName={this.props.nodeName + 'Graph'} linkName={this.props.linkName + 'Graph'} nameClass={this.props.nameClass + 'Graph'} editableGraph={false} />
                    </Tab>
                </Tabs>
            }
        </Col>
    </Row>
    }
}
export default ResultComponent