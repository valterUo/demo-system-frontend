import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import RelationalTabs from '../dataComponents/relationalComponents/relationalTabs'
import Graph from '../dataComponents/graphComponents/Graph'
import NewTree from '../dataComponents/newTreeComponents/newTree'
import Col from 'react-bootstrap/Col'
import style from '../styles'
import Button from 'react-bootstrap/Button'
import CategoricalViewOfQuery from './queryComponents/CategoricalViewOfQuery'

class ResultComponent extends Component {

    render() {
        let renderedElement = null

        if (this.props.resultSet.model === "relational" && this.props.resultSet.resultData !== undefined) {
            renderedElement = <Col>
                <RelationalTabs width={this.props.width} height={this.props.height} key={this.props.resultSet.key} tables={this.props.resultSet.resultData} />
            </Col>
        } else if (this.props.resultSet.model === "graph" && this.props.resultSet.resultData !== undefined) {
            renderedElement = <Graph key={this.props.resultSet.key} data={this.props.resultSet.resultData} width={this.props.width} height={this.props.height} nodeName={'GraphNodes'} linkName={'GraphLinks'}
                nameClass={'GraphClassName'} editableGraph={false} />
        } else if (this.props.resultSet.model === "xml" && this.props.resultSet.resultData !== undefined) {
            renderedElement = <NewTree key={this.props.resultSet.key} treeResult={this.props.resultSet.resultData} width={this.props.width} height={this.props.height} />
        }
        if (renderedElement === null || (this.props.showResult === false && this.props.showCategoricalView === false)) {
            return null
        } else if (this.props.showCategoricalView === true) {

            return <Row style={style.basicComponentsStyle}>
                <Container style={{ margin: "5px" }} fluid="true">
                    <Col style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px" }}>
                        <Row style={{ marginTop: '5px' }}>
                            <h4>Categorical view of the query {this.props.header}</h4>
                        </Row>
                        <Row ref={this.mainContainer} style={{ "margin": "10px" }}>
                            <CategoricalViewOfQuery dataSet = {this.props.dataSet} query={this.props.query} width={this.props.width} height={this.props.height} />
                        </Row>
                    </Col>
                </Container>
            </Row>

        } else {

            return <Row style={style.basicComponentsStyle}>
                <Container style={{ margin: "5px" }} fluid="true">
                    <Col style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px" }}>
                        <Row style={{ marginTop: '5px' }}>
                            <h4>Result</h4>
                            <Button style={{ marginLeft: "15px", marginTop: "5px", height: "30px" }} size="sm" variant="dark" onClick={this.props.initializeResult}>Empty</Button>
                        </Row>
                        <Row ref={this.mainContainer} style={{ "margin": "10px" }}>
                            {renderedElement}
                        </Row>
                    </Col>
                </Container>
            </Row>
        }
    }
}
export default ResultComponent