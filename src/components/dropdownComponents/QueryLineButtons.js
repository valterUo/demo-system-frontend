import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import style from '../../styles'
import Row from 'react-bootstrap/Row'
import Dropdown from 'react-bootstrap/Dropdown'

class QueryLineButtons extends Component {
  constructor(props) {
    super(props)
    this.state = {
      queryModel: ""
    }
  }

  handleQueryModel = (model) => {
    console.log(model)
    this.props.handleQueryModelChange(model.toLowerCase())
    this.setState({
      queryModel: model
    })
  }

  render() {
    return <Row style={{ margin: "5px" }}>
      <div style={style.queryButtonStyle}>
        <Button variant="dark" onClick={this.props.addAnd} disabled={!this.props.acceptAND}>Add AND</Button>
      </div>
      <div style={style.queryButtonStyle}>
        <Button variant="dark" onClick={this.props.emptyQuery}>Delete all</Button>
      </div>
      <div style={style.queryButtonStyle}>
        <Dropdown>
          <Dropdown.Toggle variant="dark" id="dropdown-basic">
            {this.state.queryModel === "" ? "Select return model" : this.state.queryModel}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="1" onClick={() => this.handleQueryModel("Table")}>Table</Dropdown.Item>
            <Dropdown.Item eventKey="2" onClick={() => this.handleQueryModel("Tree")}>Tree</Dropdown.Item>
            <Dropdown.Item eventKey="3" onClick={() => this.handleQueryModel("Graph")}>Graph</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div style={style.queryButtonStyle}>
        <Button variant="dark" onClick={this.props.submitQuery}>Execute query</Button>
      </div>
    </Row>
  }
}

export default QueryLineButtons