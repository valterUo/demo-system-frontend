import React, { Component } from 'react'
import style from '../../styles'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FreeTextInputQueryLineButtons from './FreeTextInputQueryLineButtons'
import FileSubmitComponent from '../FileSubmitComponent'

class FreeTextInputQueryComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: ""
        }
    }

    render() {
        return <Row style={style.basicComponentsStyle}>
            <Col xl={1}>
                <h4 align="right">Input</h4>
            </Col>
            {/*<Col xl={2}>
            <Dropdown style={{ marginTop: "4px" }}>
                <Dropdown.Toggle variant="light" id="dropdown-query-mode">
                    {this.state.queryMode === "" ? "Query mode" : this.state.queryMode}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item action="true" variant="primary" onClick={() => this.handleMLcompiler()}>ML code compiler</Dropdown.Item>
                    <Dropdown.Item action="true" variant="primary" onClick={() => this.handleFunctionDefinition()}>Source and target</Dropdown.Item>
                </Dropdown.Menu>
    </Dropdown>
        </Col>*/}
            <Col xl={6} style={{ align: "left" }}>
                <Form onSubmit={this.props.handleQuery} inline>
                    <Form.Control as="textarea" rows="2" placeholder="Enter query or choose defined query" value={this.props.query} onChange={this.props.handleQueryChange} style={{ width: "90%", marginRight: "5px" }} />
                    <Button type="submit" variant="dark"> <i className='fas fa-play' style={{ fontSize: '24px', marginTop: "4px" }}></i> </Button>
                </Form>
                {/*this.state.acceptFunctions && <Form onSubmit={this.handleSourceTargetSubmit} inline>
                    <Form.Control as="textarea" rows="1" placeholder="Enter source function" value={this.state.sourceFunction} onChange={this.handleSourceFunctionChange} style={{ width: "45%", marginRight: "5px" }} />
                    <Form.Control as="textarea" rows="1" placeholder="Enter target function" value={this.state.targetFunction} onChange={this.handleTargetFunctionChange} style={{ width: "45%", marginRight: "5px" }} />
                    <Button type="submit" variant="dark"> <i className='fas fa-play' style={{ fontSize: '24px', marginTop: "4px" }}></i> </Button>
    </Form>*/}
            </Col>
            <Col xl={3}>
                <FreeTextInputQueryLineButtons handleDataModelChange={this.props.handleDataModelChange} handleCoreLanguage={this.props.handleCoreLanguage} />
            </Col>
            <Col xl={2}>
                <FileSubmitComponent />
            </Col>
        </Row>
    }
}

export default FreeTextInputQueryComponent