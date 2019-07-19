import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import style from '../../styles'
import Row from 'react-bootstrap/Row'
import Dropdown from 'react-bootstrap/Dropdown'

class QueryLineButtons extends Component {
  constructor(props) {
    super(props)
    this.state = {
      queryModel: "", coreLanguage: "Haskell"
    }
    this.handleLanguageChange = this.handleLanguageChange.bind(this)
  }

  handleDataModel = (model) => {
    console.log(model)
    this.props.handleDataModelChange(model.toLowerCase())
    this.setState({
      queryModel: model
    })
  }

  handleLanguageChange = (event) => {
    event.preventDefault()
    this.setState({
      coreLanguage: event.target.value
    })
    this.props.handleCoreLanguage(event.target.value)
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
        <ButtonToolbar >
          <ToggleButtonGroup type="radio" name="core-language-options" defaultValue = {"Haskell"}>
          <ToggleButton variant="dark" value={"Haskell"} checked = {this.state.coreLanguage === "Haskell"} onChange={this.handleLanguageChange}>Haskell</ToggleButton>
            <ToggleButton variant="dark" value={"SML"} checked = {this.state.coreLanguage === "SML"} onChange={this.handleLanguageChange}>SML</ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
      </div>
      <div style={style.queryButtonStyle}>
        <Dropdown>
          <Dropdown.Toggle variant="dark" id="dropdown-basic">
            {this.state.queryModel === "" ? "Select return model" : this.state.queryModel}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="1" onClick={() => this.handleDataModel("Table")}>Table</Dropdown.Item>
            <Dropdown.Item eventKey="2" onClick={() => this.handleDataModel("Tree")}>Tree</Dropdown.Item>
            <Dropdown.Item eventKey="3" onClick={() => this.handleDataModel("Graph")}>Graph</Dropdown.Item>
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