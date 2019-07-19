/* eslint-disable default-case */
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
import store from '../store'
import QueryAnswerParser from '../services/queryAnswerParser'

class NewQueryComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: "", acceptAND: false, acceptedRelations: SchemaInfoForDropdowns.relations, savedVariables: new Set([]), returnValue: "Return ", dropdownMenu: [], predicate: "",
      firstParameter: "", secondParameter: "", firstType: "", secondType: ""
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
      query: "", acceptAND: false, acceptedRelations: SchemaInfoForDropdowns.relations, savedVariables: new Set([]), returnValue: "Return ", dropdownMenu: [], predicate: "",
      firstParameter: "", secondParameter: "", firstType: "", secondType: ""
    })
  }

  buildQuery = () => {
    let letterA = ""
    let letterB = ""
    switch (this.state.firstType[0]) {
      case 'Customer':
        letterA = "C"
        break
      case 'Product':
        letterA = "P"
        break
      case 'Order':
        letterA = "O"
        break
    }
    switch (this.state.secondType[0]) {
      case 'Customer':
        letterB = "C"
        break
      case 'Product':
        letterB = "P"
        break
      case 'Order':
        letterB = "O"
        break
    }
    let metaParameterA = ""
    let metaParameterB = ""
    switch (this.state.firstType[1]) {
      case "VAR":
        metaParameterA = "VAR" + letterA + '("' + this.state.firstParameter + '")'
        break
      case "CONSTANT":
        metaParameterA = "CONSTANT(mult" + letterA + "(" + this.state.firstType[0].toLowerCase() + "(" + this.state.firstParameter + ")))"
        break
    }
    switch (this.state.secondType[1]) {
      case "VAR":
        metaParameterB = "VAR" + letterB + '("' + this.state.secondParameter + '")'
        break
      case "CONSTANT":
        metaParameterB = "CONSTANT(mult" + letterB + "(" + this.state.secondType[0].toLowerCase() + "(" + this.state.secondParameter + ")))"
        break
    }
    const queryExample = 'val x = SOLUTION_SET((TESTINPUT),' + this.state.predicate + '(ID('
      + letterA + '), ID(' + letterB + ')),' + metaParameterA + ',' + metaParameterB + ');'
    return queryExample
  }

  submitQuery = async () => {
    var headers = {
      'Content-Type': 'text/plain'
    }
    const smlQuery = this.buildQuery()
    console.log(smlQuery)
    const query = await axios.post('http://localhost:3001/ml', smlQuery, { headers: headers })
    console.log(query)
    const answer = await axios.post('http://localhost:3001/ml', 'PRINTMULT_MULT_SET(x);', { headers: headers })
    if (answer.data.includes("empty_set") || answer.data.includes("Error")) {
      store.dispatch({ type: 'ADD_NOTIFICATION', message: "Answer is empty.", variant: "warning" })
      setTimeout(() => store.dispatch({ type: 'DELETE_NOTIFICATION' }), 5000)
    } else {
      let attributes
      switch (this.state.userChooseModel) {
        case "graph":
          attributes = ["id", "name", "Credit limit"]
          break
        case "tree":
          attributes = ["id", "id", "name"]
          break
        case "sql":
          attributes = [""]
          break
      }
      const parsedAnswer = QueryAnswerParser.queryAnswerParser(answer.data.replace('\n-', '').trim(), attributes, this.state.userChooseModel)
      store.dispatch({ type: 'ADD_DATA', data: parsedAnswer, model: this.state.userChooseModel, key: this.state.model + "Key" })
      console.log(answer)
    }
  }

  printDropdownMenu = () => {
    if (this.state.dropdownMenu.length === 0) {
      return <MainDropdownMenu acceptedRelations={this.state.acceptedRelations} handleNextRelationSelection={handleNextSelection}
        acceptAND={this.state.acceptAND} buildQueryAndChangeDropdown={this.buildQueryAndChangeDropdown} />
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
    switch (parameter) {
      case 'Customer constant':
        parameters.push('0, "Mary", 5000',
          '1, "John", 2000',
          '2, "William", 3000',
          '3, "Daddy", 200',
          '4, "William", 30',
          '5, "Erica", 8000',
          '6, "Mill", 0',
          '7, "Bob", 9999')
        break
      case 'Product constant':
        parameters.push('"2343f", "Toy", 66',
          '"3424g", "Book", 40',
          '"2543f", "Guitar", 666',
          '"3424g", "Book", 40',
          '"5467y", "Pen", 2',
          '"5698r", "Car", 9999',
          '"7890u", "Cup", 24',
          '"896h", "Jewelry", 5000')
        break
      case 'Order constant':
        parameters.push('"77idy65", [product("5467y", "Pen", 2:int), product("5698r", "Car", 9999:int)]',
          '"34e5e79", [product("2343f", "Toy", 66:int), product("3424g", "Book", 40:int)]')
        break
      case 'Integer constant':
        parameters.push("test const")
        break
      case 'String constant':
        parameters.push("test const")
        break
    }
    const element = <div><NewOneParameterDropdownMenu type={parameter.split(' ')[0]} location={location} relation={relation} parameters={parameters} acceptDropdown={true} handleParameters={this.handleParameters} /></div>
    this.changeDropdownElement(element, location)
  }

  handleVariables = (parameter, location, relation) => {
    let inputType = parameter.split(' ')[0]
    let inputElement =
      <Form inline key="constantInputForm" name="constantInput" style={{ paddingLeft: "3px", paddingRight: "3px", marginBottom: "4px" }}>
        <Form.Control key="constantInput" type="text" size='sm' placeholder="" ref={input => this.currentInput = input}
          onKeyDown={this.handleFreeInput.bind(this, inputType, location, relation)} />
      </Form>
    this.changeDropdownElement(inputElement, location)
  }

  handleFreeInput = (inputType, location, relation, event) => {
    console.log(inputType)
    if (event.keyCode === 13) {
      event.preventDefault()
      const inputValue = this.currentInput.value
      let newVariables = new Set(this.state.savedVariables)
      newVariables.add({ "variable": inputValue, "type": inputType })
      if (location[0] === location[1]) {
        this.setState((prevState) => {
          let tempMenu = prevState.dropdownMenu
          tempMenu.shift()
          tempMenu.shift()
          return {
            predicate: relation,
            secondParameter: inputValue,
            secondType: [inputType, "VAR"],
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
            firstParameter: inputValue,
            firstType: [inputType, "VAR"],
            query: prevState.query + inputValue + " ",
            dropdownMenu: tempMenu,
            savedVariables: newVariables
          }
        })
      }
    }
  }

  handleParameters = (parameter, location, relation, type) => {
    if (parameter.includes("constant")) {
      console.log(parameter)
      this.handleConstants(parameter, location, relation)
    } else if (parameter.includes("variable")) {
      this.handleVariables(parameter, location, relation)
    } else {
      console.log(parameter, relation, type)
      if (location[0] === location[1]) {
        this.setState((prevState) => {
          let tempMenu = prevState.dropdownMenu
          tempMenu.shift()
          tempMenu.shift()
          return {
            predicate: relation,
            secondParameter: parameter,
            secondType: [type, "CONSTANT"],
            query: prevState.query + relation + " (" + parameter + ")",
            dropdownMenu: tempMenu,
            acceptAND: true
          }
        })
      } else {
        this.setState((prevState) => {
          let tempMenu = prevState.dropdownMenu
          tempMenu.shift()
          return {
            firstParameter: parameter,
            firstType: [type, "CONSTANT"],
            query: prevState.query + " (" + parameter + ") ",
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
      <QueryLineButtons handleCoreLanguage={this.props.handleCoreLanguage} addAnd={this.addAnd} emptyQuery={this.emptyQuery} submitQuery={this.submitQuery} acceptAND={this.state.acceptAND} handleDataModelChange={this.props.handleDataModelChange} />
    </Container>
  }
}

export default NewQueryComponent