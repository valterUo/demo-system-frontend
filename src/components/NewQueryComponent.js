import React, { Component } from 'react'
import axios from 'axios'
import style from '../styles'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import MainDropdownMenu from './dropdownComponents/MainDropdownMenu'
import QueryReturnDropdown from './dropdownComponents/QueryReturnDropdown'
import SchemaInfoForDropdowns from './dropdownComponents/SchemaInfoForDropdowns.json'
import QueryLineButtons from './dropdownComponents/QueryLineButtons'
import NewOneParameterDropdownMenu from './dropdownComponents/NewOneParameterDropdownMenu'
import { handleNextSelection } from './dropdownComponents/HandleNextSelection'

class NewQueryComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: "", acceptAND: false, acceptedRelations: SchemaInfoForDropdowns.all, savedVariables: new Set([]), returnValue: "Return ", dropdownMenu: []
    }
    this.currentInput = ""
  }

  addAnd = () => {
    this.setState((prevState) => ({
      query: prevState.query + " AND ",
      acceptAND: false
    }))
  }

  emptyQuery = () => {
    this.setState({
      query: "", acceptAND: false, savedVariables: new Set([]), returnValue: "Return ", dropdownMenu: []
    })
  }

  submitQuery = async () => {
    console.log(this.state.query + "\n" + this.state.returnValue)
    var headers = {
      'Content-Type': 'text/plain'
    }
      const answer = await axios.post('http://localhost:3001/ml', this.state.query  + "(T'', G'', E'', sq');", { headers: headers })
      console.log(answer)
  }

  printDropdownMenu = () => {
    if (this.state.dropdownMenu.length === 0) {
      return <MainDropdownMenu acceptedRelations={this.state.acceptedRelations} handleNextRelationSelection={handleNextSelection} acceptAND={this.state.acceptAND} buildQueryAndChangeDropdown={this.buildQueryAndChangeDropdown} />
    } else {
      return this.state.dropdownMenu.map((element, i) => {
        return <div key={i}>{element}</div>
      })
    }
  }

  buildQueryAndChangeDropdown = (relation, parameters) => {
    let tempDropdown = []
    if (parameters[0] === undefined) {
      this.setState((prevState) => {
        return {
          query: prevState.query + relation
        }
      }
      )
    } else {
      if (typeof parameters[0] === "object") { //two place predicate
        const element1 = <div>&nbsp;<NewOneParameterDropdownMenu relation={relation} parameters={parameters[0]} location={[1, 2]} acceptDropdown={true} handleParameters={this.handleParameters} /></div>
        const element2 = <div>&nbsp;{relation}&nbsp;</div>
        const element3 = <NewOneParameterDropdownMenu relation={relation} parameters={parameters[1]} location={[2, 2]} acceptDropdown={true} handleParameters={this.handleParameters} />
        tempDropdown.push(element1, element2, element3)
      } else { // one place predicate
        const element1 = <div>{relation}</div>
        const element2 = <div>&nbsp; <NewOneParameterDropdownMenu relation={relation} parameters={parameters} location={[1, 1]} acceptDropdown={true} handleParameters={this.handleParameters} /></div>
        tempDropdown.push(element1, element2)
      }
      this.setState({
        dropdownMenu: tempDropdown
      })
    }
  }

  handleConstants = (parameter, location, relation) => {
    console.log(parameter, location, relation)
    let parameters = []
    // eslint-disable-next-line default-case
    switch (parameter) {
      case 'Customer constant':
        parameters.push("Mary", "John", "William")
        break
      case 'Product constant':
        parameters.push("test const")
        break
      case 'Order constant':
        parameters.push("test const")
        break
      case 'Integer constant':
        parameters.push("test const")
        break
      case 'String constant':
        parameters.push("test const")
        break
    }
    const element = <div><NewOneParameterDropdownMenu location={location} relation={relation} parameters={parameters} acceptDropdown={true} handleParameters={this.handleParameters} /></div>
    this.changeDropdownElement(element, location)
  }

  handleVariables = (parameter, location, relation) => {
    let inputType = parameter.split(' ')[0]
    let inputElement =
      <Form inline key="constantInputForm" name="constantInput" style={{ paddingLeft: "3px", paddingRight: "3px", marginBottom: "4px" }}>
        <Form.Control key="constantInput" type="text" size='sm' placeholder="" ref={input => this.currentInput = input} onKeyDown={this.handleFreeInput.bind(this, inputType, location, relation)} />
      </Form>
    this.changeDropdownElement(inputElement, location)
  }

  handleFreeInput = (inputType, location, relation, event) => {
    if (event.keyCode === 13) {
      event.preventDefault()
      const inputValue = this.currentInput.value
      let newVariables = new Set(this.state.savedVariables)
      newVariables.add({ "variable": inputValue, "type": inputType.split(' ')[0] })
      if (location[0] === location[1]) {
        this.setState((prevState) => {
          let tempMenu = prevState.dropdownMenu
          tempMenu.shift()
          tempMenu.shift()
          return {
            query: prevState.query + relation + " " + inputValue,
            dropdownMenu: tempMenu,
            acceptAND: true,
            savedVariables: newVariables
          }
        })
      } else {
        this.setState((prevState) => {
          let tempMenu = prevState.dropdownMenu
          tempMenu.shift()
          return {
            query: prevState.query + inputValue + " ",
            dropdownMenu: tempMenu,
            savedVariables: newVariables
          }
        })
      }
    }
  }

  handleParameters = (parameter, location, relation) => {
    if (parameter.includes("constant")) {
      this.handleConstants(parameter, location, relation)
    } else if (parameter.includes("variable")) {
      this.handleVariables(parameter, location, relation)
    } else {
      if (location[0] === location[1]) {
        this.setState((prevState) => {
          let tempMenu = prevState.dropdownMenu
          tempMenu.shift()
          tempMenu.shift()
          return {
            query: prevState.query + relation + " " + parameter,
            dropdownMenu: tempMenu,
            acceptAND: true
          }
        })
      } else {
        this.setState((prevState) => {
          let tempMenu = prevState.dropdownMenu
          tempMenu.shift()
          return {
            query: prevState.query + parameter + " ",
            dropdownMenu: tempMenu
          }
        })
      }
    }
  }

  changeDropdownElement = (element, location) => {
    this.setState((prevState) => {
      let tempMenu = prevState.dropdownMenu
      if (location[0] === location[1]) {
        tempMenu.pop()
        tempMenu.push(element)
      } else {
        tempMenu.shift()
        tempMenu.unshift(element)
      }
      return {
        dropdownMenu: tempMenu
      }
    })
  }

  selectReturnValue = (value) => {
    this.setState((prevState) => {
      let prevValue = prevState.returnValue
      prevValue += value
      return {
        returnValue: prevValue
      }
    })
  }

  render() {
    return <Container style={{ margin: "5px" }} fluid="true">
      <Row style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px" }}>
        <Col xl={1}>
          <Row style={{ marginTop: '5px' }}>
            <h4> Query: </h4>
          </Row>
        </Col>
        <Col>
          <Row style={style.basicComponentsStyle}>
            <Col>
              <Row style={style.queryTextStyle}>
                {this.state.query}
                {this.printDropdownMenu()}
              </Row>
              <QueryReturnDropdown savedVariables={[...this.state.savedVariables]} selectReturnValue={this.selectReturnValue} />
            </Col>
          </Row>
        </Col>
      </Row>
      <QueryLineButtons addAnd={this.addAnd} emptyQuery={this.emptyQuery} submitQuery={this.submitQuery} acceptAND={this.state.acceptAND} />
    </Container>
  }
}

export default NewQueryComponent