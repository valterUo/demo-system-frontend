import React, { Component } from 'react'
import style from '../../styles'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import SelectDataSetComponent from '../SelectDataSetComponent'

class FreeTextInputQueryComponent extends Component {

    render() {
        return <Row style={style.basicComponentsStyle}>
            <Col xl={1}>
                <h4 align="right">Input</h4>
            </Col>
            <Col xl={8} style={{ align: "left" }}>
                <Form onSubmit={this.props.handleQuery} inline>
                    <Form.Control as="textarea" rows="2" placeholder="Enter query or choose defined query" value={this.props.query} onChange={this.props.handleQueryChange} style={{ width: "90%", marginRight: "5px" }} />
                    <Button type="submit" variant="dark"> <i className='fas fa-play' style={{ fontSize: '24px', marginTop: "4px" }}></i> </Button>
                </Form>
            </Col>
            <Col xl={2}>
                <SelectDataSetComponent handleDataSetChange={this.props.handleDataSetChange} />
            </Col>
            <Col xl={1}>
                <i className="fa fa-info-circle" style={{ fontSize: "28px", margin: "20px" }} aria-hidden="true" onClick={() => this.props.togglePopup("main")}></i>
            </Col>
        </Row>
    }
}

export default FreeTextInputQueryComponent