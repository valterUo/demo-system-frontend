import React, { Component } from 'react'
import style from '../styles'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class FoldViewBox extends Component {

    render() {
        return <Col>
            <Row style={style.basicComponentsStyle}>
                <Col>
                    <h4> Query corresponds fold</h4>
                    <div>
                        {this.props.fold}
                    </div>
                </Col>
            </Row>
        </Col>
    }
}

export default FoldViewBox