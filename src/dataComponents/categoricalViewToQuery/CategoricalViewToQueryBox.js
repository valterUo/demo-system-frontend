import React, { Component } from 'react'
import style from '../../styles'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import QueryGraph from './QueryGraph'
import Button from 'react-bootstrap/Button'

class CategoricalViewToQueryBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mainFoldDiagram: undefined, lambdaFunctions: [], selectedDataset: undefined
        }
    }

    handleDataChangeFirstTime = (data) => {
        this.setState({ mainFoldDiagram: data["mainFoldDiagram"], lambdaFunctions: data["lambdaFunctions"], selectedDataset: data["mainFoldDiagram"] })
    }

    handleDataChange = (id) => {
        if (id === 0) {
            this.setState({ selectedDataset: this.state.mainFoldDiagram })
        } else {
            let selectedLambdaFunction
            this.state.lambdaFunctions.map(lambda => {
                if (lambda["id"] === id) {
                    selectedLambdaFunction = lambda
                }
                return lambda
            })
            this.setState({ selectedDataset: selectedLambdaFunction })
        }
    }

    render() {
        if (this.state.selectedDataset !== undefined) {
            return <Row style={style.basicComponentsStyle}>
                <Container style={{ margin: "5px" }} fluid="true">
                <Col style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px" }}>
                    <Button onClick = {this.handleDataChange.bind(this)}>
            
                    </Button>
                </Col>
                    <Col style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px" }}>
                        <Row style={{ marginTop: '5px' }}>
                            <h4>Categorical view of the query {this.props.header}</h4>
                        </Row>
                        <Row ref={this.mainContainer} style={{ "margin": "10px" }}>
                            <QueryGraph dataSet={this.state.selectedDataset} width={this.props.width} height={this.props.height} />
                        </Row>
                    </Col>
                </Container>
            </Row>
        } else {
            return null
        }
    }
}

export default CategoricalViewToQueryBox