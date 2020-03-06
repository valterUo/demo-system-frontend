import React, { Component } from 'react'
import style from '../styles'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ErrorBoundary from '../errorBoundary/ErrorBoundary'

class StatBox extends Component {

    render() {
        let dataBlock = <div />
        const data = this.props.data.data
        if (data[0]["key"] !== undefined && data[0]["key"] !== "") {
            dataBlock = data.map(l => <p key={l["key"]}><b>{l["key"]} : </b> {l["value"]}</p>)
        }
        let header = "Contents"
        if (this.props.data.header !== undefined) {
            header = this.props.data.header
        }

        return <Col>
            <ErrorBoundary>
                <Row style={style.basicComponentsStyle}>
                    <Col>
                        <h4> {header} </h4>
                        <div>
                            {dataBlock}
                        </div>
                    </Col>
                </Row>
            </ErrorBoundary>
        </Col>
    }
}

export default StatBox