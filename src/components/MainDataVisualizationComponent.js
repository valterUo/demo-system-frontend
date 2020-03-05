import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import RelationalTabs from '../dataComponents/relationalComponents/relationalTabs'
import Graph from '../dataComponents/graphComponents/Graph'
import NewTree from '../dataComponents/newTreeComponents/newTree'
import Col from 'react-bootstrap/Col'
import style from '../styles'
import Button from 'react-bootstrap/Button'
import CategoricalViewToQueryBox from '../dataComponents/categoricalViewToQuery/CategoricalViewToQueryBox'

class MainDataVisualizationComponent extends Component {

    render() {
        const model = this.props.resultSet.model
        const data = this.props.resultSet.resultData
        const key = this.props.resultSet.key
        const width = this.props.width
        const height = this.props.height
        let renderedElement = null

        if (data !== undefined && this.props.showResult === true) {
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
                    console.log("Error in expressing the result. The result model is not defined.")
            }
        }

        if (renderedElement !== null && this.props.showResult === true && this.props.showCategoricalView === false) {
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
        } else if (this.props.showResult === false && this.props.showCategoricalView === true) {
            return <CategoricalViewToQueryBox data={data.data} width={width} height={height} />
        } else {
            return null
        }
    }
}
export default MainDataVisualizationComponent