import React, { Component } from 'react'
import style from '../styles'
import Row from 'react-bootstrap/Row'

class FoldViewBox extends Component {
    render() {
        return <Row style={style.basicComponentsStyle}> <div className= "col">
            <h4> Query corresponds fold</h4>
            <div>
                {this.props.fold}
            </div>
        </div>
        </Row>
    }
}

export default FoldViewBox