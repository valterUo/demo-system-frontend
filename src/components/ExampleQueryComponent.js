import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ExampleQueryTypeComponent from './ExampleQueryTypeComponent'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'

class ExampleQueryComponent extends Component {

    render() {
        return <Container style={{ margin: "5px" }} fluid="true">
            <Row style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px" }}>
                    <div style={{ marginTop: '5px' }}>
                        <h4>{this.props.header}</h4>
                    </div>
                <Row style={{ "margin": "10px" }}>
                    <ButtonToolbar>
                        {this.props.examples.examples.map((exampleCase, i) =>
                            <ExampleQueryTypeComponent key={`${i}`} header={exampleCase["header"]} examples={exampleCase["examples"]} handleExampleQuery={this.props.handleExampleQuery} />)}
                    </ButtonToolbar>
                </Row>
            </Row>
        </Container>
    }
}
export default ExampleQueryComponent