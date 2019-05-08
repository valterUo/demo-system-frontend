import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import style from '../../styles'
import Row from 'react-bootstrap/Row'

class QueryLineButtons extends Component {

    render() {
        return <Row style={{ margin: "5px" }}>
        <div style={style.queryButtonStyle}>
          <Button variant="dark" onClick={this.props.addAnd} disabled={!this.props.acceptAND}>Add AND</Button>
        </div>
        <div style={style.queryButtonStyle}>
          <Button variant="dark" onClick={this.props.emptyQuery}>Delete all</Button>
        </div>
        <div style={style.queryButtonStyle}>
          <Button variant="dark" onClick={this.props.submitQuery}>Execute query</Button>
        </div>
      </Row>
    }
}

export default QueryLineButtons