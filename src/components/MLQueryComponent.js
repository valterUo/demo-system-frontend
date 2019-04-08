import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import style from '../styles'

class MLQueryComponent extends Component {
    
    render() {
        return <Row style={style.basicComponentsStyle}>
        <div style = {{marginLeft: "10px"}}>
            {this.props.answers.map((answer, i) => <p key = {i} >{answer}</p>)}
            </div>
        </Row>
    }
}
export default MLQueryComponent