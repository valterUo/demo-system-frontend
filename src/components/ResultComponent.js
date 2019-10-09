import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import RelationalTabs from '../dataComponents/relationalComponents/relationalTabs'
import Graph from '../dataComponents/graphComponents/Graph'
import NewTree from '../dataComponents/newTreeComponents/newTree'
import Col from 'react-bootstrap/Col'
import style from '../styles'
import Accordion from 'react-bootstrap/Accordion'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import CategoricalViewOfQuery from './queryComponents/CategoricalViewOfQuery'

function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionToggle(eventKey)
    return (
        <Button type="button" variant="dark" onClick={decoratedOnClick}>
            {children}
        </Button>
    )
}

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
        } else if (this.props.resultSet.model === "tree" && this.props.resultSet.resultData !== undefined) {
            renderedElement = <NewTree key={this.props.resultSet.key} treeResult={this.props.resultSet.resultData} width={this.props.width} height={this.props.height} />
        }
        if (renderedElement == null) {
            return null
        } else {
            console.log(this.props.resultSet.resultData)
            return <Row>
                <Container fluid="true">
                    <Card >
                        <Card.Header style={{ backgroundColor: "#BDF2FF" }}>
                            <Row>
                                <h4>Result</h4>
                                <Button style={{ marginLeft: "15px" }} size="sm" variant="dark" onClick={this.props.initializeResult}>Empty</Button>
                            </Row>
                        </Card.Header>
                    </Card>
                    <Accordion defaultActiveKey="r0">
                        <Card >
                            <Card.Header>
                                <CustomToggle eventKey="r0">Result</CustomToggle>
                            </Card.Header>
                        </Card>
                        <Accordion.Collapse eventKey="r0">
                            <Row style={style.basicComponentsStyle}>
                                {renderedElement}
                            </Row>
                        </Accordion.Collapse>
                        <Card >
                            <Card.Header>
                                <CustomToggle eventKey="r1">Categorical view of the query</CustomToggle>
                            </Card.Header>
                        </Card>
                        <Accordion.Collapse eventKey="r1">
                            <Row style={style.basicComponentsStyle}>
                                <CategoricalViewOfQuery query={this.props.query} width={this.props.width} height={this.props.height} />
                            </Row>
                        </Accordion.Collapse>
                    </Accordion>
                </Container>
            </Row>
        }
    }
}
export default ResultComponent