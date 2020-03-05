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
            mainFoldDiagram: undefined, lambdaFunctions: [], selectedDataset: undefined, renderButton: false, id: undefined
        }
    }

    componentDidMount = () => {
        console.log(this.props.data)
        this.setState({ mainFoldDiagram: this.props.data["foldDiagram"], lambdaFunctions: this.props.data["lambdaFunctions"], selectedDataset: this.props.data["foldDiagram"], id: this.props.data["foldDiagram"]["id"], renderButton: "hidden" })
    }

    handleDataChange = (id) => {
        console.log(id)
        if (id === 0) {
            this.setState({ selectedDataset: this.state.mainFoldDiagram, renderButton: "hidden", id: this.state.mainFoldDiagram["id"] })
        } else {
            let selectedLambdaFunction = undefined
            this.state.lambdaFunctions.map(lambda => {
                console.log(lambda["id"])
                if (lambda["id"] === id) {
                    selectedLambdaFunction = lambda
                }
                return lambda
            })
            if (selectedLambdaFunction !== undefined) {
                this.setState({ selectedDataset: selectedLambdaFunction, id: selectedLambdaFunction["id"], renderButton: "visible" })
            }
        }
    }

    render() {
        if (this.state.selectedDataset !== undefined) {
            console.log(this.state.selectedDataset)
            return <Row style={style.basicComponentsStyle}>
                <Container style={{ margin: "5px" }} fluid="true">
                    <Col style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px" }}>
                        <Row style={{ marginTop: '5px' }}>
                            <h4>Categorical view of the query {this.props.header}</h4>
                        </Row>
                        <Col style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px", visibility: this.state.renderButton}}> <Button variant="dark" onClick={() => this.handleDataChange(0)}>Back</Button></Col>
                        <Row ref={this.mainContainer} style={{ "margin": "10px" }}>
                            <QueryGraph key={this.state.id} data={this.state.selectedDataset} width={this.props.width} height={this.props.height} nodeName={"categoricalViewToQueryNode" + this.state.id}
                                linkName={"categoricalViewToQueryLink" + this.state.id} nameClass={"categoricalViewToQueryClass" + this.state.id} handleDataChange={this.handleDataChange.bind(this)} />
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