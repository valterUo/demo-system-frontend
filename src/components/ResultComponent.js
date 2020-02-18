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
import Notification from '../actions/NotificationAction'



class ResultComponent extends Component {

    render() {
        let renderedElement = null
        const model = this.props.resultSet.model
        const data = this.props.resultSet.resultData
        const key = this.props.resultSet.key
        const width = this.props.width
        const height = this.props.height
        if(data !== undefined) {
            switch (model) {
            case "relational":
                renderedElement = <Col><RelationalTabs width={width} height={height} key={key} data={data} /></Col>
                break
            case "algebraic graph":
            case "nimblegraph":
            case "rdf":
                renderedElement = <Graph key={key} data={data} width={width} height={height} nodeName={'GraphNodes'} linkName={'GraphLinks'}
                nameClass={'GraphClassName'} editableGraph={false} />
                break
            case "xml":
            case "json":
                renderedElement = <NewTree key={key} treeResult={data} width={width} height={height} />
                break
            default:
                Notification.notify("Error in expressing the result. The result model is not defined.", "warning")
        }
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
                            <CategoricalViewOfQuery dataSet={this.props.dataSet} query={this.props.query} width={width} height={height} />
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