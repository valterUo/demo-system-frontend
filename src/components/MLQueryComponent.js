import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import style from '../styles'

class MLQueryComponent extends Component {

    render() {
        if (this.props.answers.length !== 0) {
            return <Row style={style.basicComponentsStyle}>
                <div style={{ marginLeft: "10px" }}>
                <h4>SML command line output:</h4>
                    {this.props.answers.map((answer, i) => <p key={i} >{answer}</p>)}
                </div>
            </Row>
        } else {
            return null
        }
    }
}
export default MLQueryComponent