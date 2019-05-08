import React, { Component } from 'react'
import style from '../styles'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import MainDropdownMenu from './dropdownComponents/MainDropdownMenu'
import OneParameterDropdownMenu from './dropdownComponents/OneParameterDropdownMenu'
import TwoParametersDropdownMenu from './dropdownComponents/TwoParametersDropdownMenu'
import QueryReturnDropdown from './dropdownComponents/QueryReturnDropdown'
import { initializeDropdown } from './dropdownComponents/InitializeDropDowns'
import SchemaInfoForDropdowns from './dropdownComponents/SchemaInfoForDropdowns.json'
import QueryLineButtons from './dropdownComponents/QueryLineButtons'

class QueryComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: "", acceptOneRelationParameter: false, acceptTwoRelationParameters: false, acceptSecondParameter: false, acceptAND: false,
      acceptedRelations: SchemaInfoForDropdowns.all, parameters1: [], parameters2: [], dropdownMenu: [],
      savedConstants: new Set([]), savedVariables: new Set([]), returnValue: "Return "
    }
    this.currentInput = ""
    this.commaParanthesisList = []
  }

  addAnd = () => {
    this.setState((prevState) => ({
      query: prevState.query + " AND ",
      acceptAND: false
    }))
  }

  emptyQuery = () => {
    this.setState({
      query: "",
      acceptAND: false,
      dropdownMenu: [],
      savedVariables: new Set([]),
      savedConstants: new Set([]),
      selectReturnValue: "Return "
    })
    this.commaParanthesisList = []
  }

  submitQuery = () => {
    console.log(this.state.query + "\n" + this.state.returnValue)
  }

  buildQueryAndChangeDropdown = (relationName, parameters) => {
    let constants = [], variables = []
    this.state.savedConstants.forEach(element => constants.push(element))
    this.state.savedVariables.forEach(element => variables.push(element.variable))
    let newParameters
    if (typeof parameters[0] === "string") {
      newParameters = parameters.concat(constants, variables)
    } else {
      newParameters = parameters.map(parameter => parameter.concat(constants, variables))
    }
    this.setState((prevState) => {
      const oldMenu = prevState.dropdownMenu
      const menucomponent = initializeDropdown(relationName, newParameters, this.handleParameters)
      oldMenu.unshift(menucomponent)
      if (menucomponent.type.name === "TwoParametersDropdownMenu") {
        this.commaParanthesisList.push(") ", ", ")
      } else {
        this.commaParanthesisList.push(") ")
      }
      return {
        query: prevState.query + relationName + "(",
        dropdownMenu: oldMenu
      }
    })
  }

  handleFreeInputChange = (event) => {
    this.currentInput = this.currentInput + event.target.value
  }

  handleFreeInput = (inputType, type, event) => {
    if (event.keyCode === 13) {
      event.preventDefault()
      const inputValue = this.currentInput.value
      let paranthesis = "", result = [], tempInput

      this.setState((prevState) => {
        if (inputType === "constant") {
          tempInput = prevState.savedConstants
          tempInput.add(inputValue)
          return {
            savedConstants: tempInput
          }
        } else if (inputType === "variable") {
          tempInput = prevState.savedVariables
          let containsElement = false
          tempInput.forEach(element => {
            if (element.variable === inputValue && element.type === type.split(' ')[0]) {
              containsElement = true
            }
          })
          if (!containsElement) {
            tempInput.add({ "variable": inputValue, "type": type.split(' ')[0] })
          }
          return {
            savedVariables: tempInput
          }
        }
      })

      this.setState((prevState) => {
        let oldMenu = prevState.dropdownMenu, newElement
        oldMenu.shift()
        const element = oldMenu.shift()
        if (element !== undefined) {
          if (element.type.name === "OneParameterDropdownMenu") {
            newElement = <OneParameterDropdownMenu key={element.key} parameters={element.props["parameters"]} handleParameters={this.handleParameters} acceptDropdown={true} />
          } else if (element.type.name === "TwoParametersDropdownMenu") {
            newElement = <TwoParametersDropdownMenu key={element.key} parameters1={element.props["parameters1"]} parameters2={element.props["parameters2"]}
              handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={true} showFirstDropDown={"none"} />
          }
          oldMenu.unshift(newElement)
          if (this.commaParanthesisList[this.commaParanthesisList.length - 1] === ", ") {
            return {
              query: prevState.query + inputValue + this.commaParanthesisList.pop(),
              dropdownMenu: oldMenu
            }
          }
          this.commaParanthesisList.some(element => {
            paranthesis += element
            result.push(element)
            return element === ", "
          })
          this.commaParanthesisList = this.commaParanthesisList.filter((element, i) => result[i] !== element)
          return {
            query: prevState.query + inputValue + paranthesis,
            dropdownMenu: oldMenu
          }
        } else {
          this.commaParanthesisList.map(element => paranthesis += element)
          this.commaParanthesisList = []
          return {
            query: prevState.query + inputValue + paranthesis,
            dropdownMenu: [],
            acceptAND: true
          }
        }
      })
    }
  }

  returnParanthesis = () => {
    let paranthesis = ""
    if (this.commaParanthesisList[this.commaParanthesisList.length - 1] === ", ") {
      paranthesis = ", "
    } else {
      this.commaParanthesisList.some(element => {
        paranthesis += element
        return element === ", "
      })
      if (!this.commaParanthesisList.includes(", ")) {
        paranthesis = paranthesis.substring(0, paranthesis.length - 2)
      }
    }
    return paranthesis
  }

  createFreeInput = (inputType, type) => {
    const paranthesis = this.returnParanthesis()
    let inputElement =
      <Form inline key="constantInputForm" name="constantInput" style={{ paddingLeft: "3px", paddingRight: "3px", marginBottom: "4px" }}>
        <Form.Control key="constantInput" type="text" size='sm' placeholder="" ref={input => this.currentInput = input} onKeyDown={this.handleFreeInput.bind(this, inputType, type)} />
        {paranthesis}
      </Form>
    this.setState((prevState) => {
      let oldMenu = prevState.dropdownMenu
      const element = oldMenu.shift()
      if (element.type.name === "TwoParametersDropdownMenu" && element.props["acceptSecondDropdown"] === false) {
        const newElement = <TwoParametersDropdownMenu key={element.key} context={element.props["context"]} parameters1={element.props["parameters1"]} parameters2={element.props["parameters2"]}
          handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={true} showFirstDropDown={"none"} />
        oldMenu.unshift(newElement)
      }
      oldMenu.unshift(inputElement)
      return {
        dropdownMenu: oldMenu
      }
    })
  }

  handleNextRelationSelection = (relation) => {

    this.setState((prevState) => ({
      previousQuery: prevState.query,
      acceptDeletePrevious: true
    }))

    switch (relation) {
      case 'CONTAINS':
        this.buildQueryAndChangeDropdown(relation, [["Order constant", "Order variable"], ["Product constant", "Product variable"]])
        return true
      case 'KNOWS':
        this.buildQueryAndChangeDropdown(relation, [["Ordered", "Customer constant", "Customer variable"], ["Ordered", "Customer constant", "Customer variable"]])
        return true
      case 'CAN_PAY_PRODUCT':
        this.buildQueryAndChangeDropdown(relation, [["Product constant", "Product variable"], ["Customer constant", "Customer variable"]])
        return true
      case 'CAN_PAY_ORDER':
        this.buildQueryAndChangeDropdown(relation, [["Order constant", "Order variable"], ["Customer constant", "Customer variable"]])
        return true
      case 'COMPARE':
        this.buildQueryAndChangeDropdown(relation, [["Price", "Credit_limit", "Customer_id", "Integer constant", "Integer variable"], ["Price", "Credit_limit", "Customer_id", "Integer constant", "Integer variable"]])
        return true
      case 'EQUALS':
        this.buildQueryAndChangeDropdown(relation, [["Price", "Credit_limit", "Customer_id", "Customer_name", "Integer constant", "Integer variable", "String constant", "String variable"],
        ["Price", "Credit_limit", "Customer_id", "Customer_name", "Integer constant", "Integer variable", "String constant", "String variable"]])
        return true
      case 'Ordered':
        this.buildQueryAndChangeDropdown(relation, ["Order constant", "Order variable"])
        return true
      case 'Product_id':
        this.buildQueryAndChangeDropdown(relation, ["Product constant", "Product variable"])
        return true
      case 'Customer_name':
        this.buildQueryAndChangeDropdown(relation, ["Ordered", "Customer constant", "Customer variable"])
        return true
      case 'Product_name':
        this.buildQueryAndChangeDropdown(relation, ["Product constant", "Product variable"])
        return true
      case 'Order_no':
        this.buildQueryAndChangeDropdown(relation, ["Order constant", "Order variable"])
        return true
      case 'Price':
        this.buildQueryAndChangeDropdown(relation, ["Product constant", "Product variable"])
        return true
      case 'Credit_limit':
        this.buildQueryAndChangeDropdown(relation, ["Ordered", "Customer constant", "Customer variable"])
        return true
      case 'Customer_id':
        this.buildQueryAndChangeDropdown(relation, ["Ordered", "Customer constant", "Customer variable"])
        return true
      default:
        return false
    }
  }

  handleConstants = (constant, context) => {
    let parameters = []
    // eslint-disable-next-line default-case
    switch (constant) {
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
    const paranthesis = this.returnParanthesis()
    const constElement = <div key={constant}> <OneParameterDropdownMenu key={constant} context={constant} parameters={parameters} handleParameters={this.handleParameters} acceptDropdown={true} />
      {paranthesis}
    </div>
    this.setState((prevState) => {
      let menu = prevState.dropdownMenu
      const element = menu.shift()
      if (element.type.name === "TwoParametersDropdownMenu" && element.props["acceptSecondDropdown"] === false) {
        const newElement = <TwoParametersDropdownMenu key={element.key} context={element.props["context"]} parameters1={element.props["parameters1"]} parameters2={element.props["parameters2"]}
          handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={true} showFirstDropDown={"none"} />
        menu.unshift(newElement)
      }
      menu.unshift(constElement)
      return {
        dropdownMenu: menu
      }
    })
  }

  handleParameters = (parameter, index, max_index, context) => {
    if (parameter.includes("constant")) {
      if (parameter.includes("Integer") || parameter.includes("String")) {
        this.createFreeInput("constant", parameter)
      } else {
        this.handleConstants(parameter)
      }
    } else if (parameter.includes("variable")) {
      this.createFreeInput("variable", parameter)
    } else {
      const value = this.handleNextRelationSelection(parameter)
      let array = this.state.dropdownMenu
      const element = array.shift()
      const newElement = <TwoParametersDropdownMenu key={element.key} context={element.props["context"]} parameters1={element.props["parameters1"]} parameters2={element.props["parameters2"]}
        handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={true} showFirstDropDown={"none"} />
      if (value && index < max_index) {
        array.unshift(newElement)
        this.setState({
          dropdownMenu: array
        })
      } else if (value && index === max_index) {
        array.shift()
        this.setState({
          dropdownMenu: array
        })
      } else {
        if (index < max_index) {
          if (element.type.name === "OneParameterDropdownMenu") {
            array.shift()
          } else {
            array.unshift(newElement)
          }
          this.setState((prevState) => ({
            query: prevState.query + parameter + this.commaParanthesisList.pop(),
            dropdownMenu: array
          }))
        } else if (index === max_index) {
          let tempQuery = this.state.query + parameter, result = [], paranthesis = ""
          if (this.commaParanthesisList[this.commaParanthesisList.length - 1] === ", ") {
            paranthesis = ", "
            this.commaParanthesisList.pop()
          } else {
            this.commaParanthesisList.some(element => {
              paranthesis += element
              result.push(element)
              return element === ", "
            })
            this.commaParanthesisList = this.commaParanthesisList.filter((element, i) => result[i] !== element)
          }
          tempQuery += paranthesis
          this.setState({
            query: tempQuery,
            dropdownMenu: array,
            acceptAND: array.length === 0
          })
        }
      }
    }
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

  printQueryDropdown = () => {
    if (this.state.dropdownMenu.length === 0) {
      return <MainDropdownMenu acceptedRelations={this.state.acceptedRelations} handleNextRelationSelection={this.handleNextRelationSelection} acceptAND={this.state.acceptAND} />
    } else {
      return this.state.dropdownMenu.map((element, i) => {
        if (i === 0) {
          if (element.type.name === "OneParameterDropdownMenu") {
            const paranthesis = this.returnParanthesis()
            return <div key={element.key}>
              <OneParameterDropdownMenu key={element.key} context={element.props["context"]} parameters={element.props["parameters"]} handleParameters={this.handleParameters} acceptDropdown={true} />
              {paranthesis}
            </div>
          } else if (element.type.name === "TwoParametersDropdownMenu") {
            return <TwoParametersDropdownMenu key={element.key} context={element.props["context"]} parameters1={element.props["parameters1"]} parameters2={element.props["parameters2"]}
              handleParameters={this.handleParameters} acceptFirstDropdown={true} acceptSecondDropdown={element.props["acceptSecondDropdown"]}
              showFirstDropDown={element.props["showFirstDropDown"]} />
          }
        }
        return element
      })
    }
  }

  render() {
    return (<Container style={{ margin: "5px" }} fluid="true">
      <Row style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px" }}>
        <Col xl={1}>
          <Row style={{ marginTop: '5px' }}>
            <h4> Query: </h4>
          </Row>
        </Col>
        <Col>
          <Row style={style.basicComponentsStyle}>
            <Col>
              <Row style={{ marginLeft: "10px", marginTop: "5px", fontFamily: "Lucida Console, Monaco, monospace" }}>
                {this.state.query}
                {this.printQueryDropdown()}
                {this.commaParanthesisList[0]}
              </Row>
              <QueryReturnDropdown savedVariables={[...this.state.savedVariables]} selectReturnValue={this.selectReturnValue} />
            </Col>
          </Row>
        </Col>
      </Row>
      <QueryLineButtons addAnd={this.addAnd} emptyQuery={this.emptyQuery} submitQuery={this.submitQuery} acceptAND={this.state.acceptAND} />
    </Container>
    )
  }
}

export default QueryComponent