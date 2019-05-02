import React, { Component } from 'react'
import style from '../styles'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import OneParameterDropdownMenu from './dropdownComponents/OneParameterDropdownMenu'
import TwoParametersDropdownMenu from './dropdownComponents/TwoParametersDropdownMenu'
import { initializeDropdown } from './dropdownComponents/InitializeDropDowns'


class QueryComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: "", acceptOneRelationParameter: false, acceptTwoRelationParameters: false, acceptSecondParameter: false, acceptAND: false,
      acceptedRelations: ["CONTAINS", "KNOWS", "CAN_PAY_PRODUCT", "CAN_PAY_ORDER", "Ordered", "Product_id",
        "Customer_name", "Product_name", "Order_no", "Price", "Credit_limit", "Customer_id", "Name", "≤", "="], parameters1: [], parameters2: [], dropdownMenu: [],
      savedConstants: [], savedVariables: []
    }
    this.currentConstant = ""
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
      dropdownMenu: []
    })
  }

  submitQuery = () => {
    console.log(this.state.query)
  }

  buildQueryAndChangeDropdown = (relationName, parameters) => {
    const constants = this.state.savedConstants, variables = this.state.savedVariables
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
        query: prevState.query + relationName + "( ",
        dropdownMenu: oldMenu
      }
    })
  }

  handleFreeInputChange = (event) => {
    this.currentConstant = this.currentConstant + event.target.value
  }

  handleFreeInput = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault()
      const constant = this.currentConstant.value
      let paranthesis = "", result = []
      this.setState((prevState) => {
        let oldMenu = prevState.dropdownMenu
        oldMenu.shift()
        const element = oldMenu.shift()
        let oldConstants = prevState.savedConstants, newElement
        oldConstants.push(constant)
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
              query: prevState.query + constant + this.commaParanthesisList.pop(),
              dropdownMenu: oldMenu,
              savedConstants: oldConstants
            }
          }
          this.commaParanthesisList.some(element => {
              paranthesis += element
              result.push(element)
              return element === ", "
          })
          this.commaParanthesisList = this.commaParanthesisList.filter((element, i) => result[i] !== element)
          return {
            query: prevState.query + constant + paranthesis,
            dropdownMenu: oldMenu,
            savedConstants: oldConstants
          }
        } else {
          this.commaParanthesisList.map(element => paranthesis += element)
          this.commaParanthesisList = []
          return {
            query: prevState.query + constant + paranthesis,
            dropdownMenu: [],
            acceptAND: true,
            savedConstants: oldConstants
          }
        }
      })
    }
  }

  createFreeInput = () => {
    let paranthesis = ""
    if (this.commaParanthesisList[this.commaParanthesisList.length - 1] === ", ") {
      paranthesis = ", "
    } else {
      this.commaParanthesisList.some(element => {
          paranthesis += element
          return element === ", "
      })
    }

    let constantInputElement =
      <Form inline key="constantInputForm" name="constantInput" style={{ paddingLeft: "3px", paddingRight: "3px", marginBottom: "4px" }}>
        <Form.Control key="constantInput" type="text" size='sm' placeholder="" ref={input => this.currentConstant = input} onKeyDown={this.handleFreeInput.bind(this)} />{paranthesis}
      </Form>

    this.setState((prevState) => {
      let oldMenu = prevState.dropdownMenu
      const element = oldMenu.shift()
      if (element.type.name === "TwoParametersDropdownMenu" && element.props["acceptSecondDropdown"] === false) {
        const newElement = <TwoParametersDropdownMenu key={element.key} context={element.props["context"]} parameters1={element.props["parameters1"]} parameters2={element.props["parameters2"]}
          handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={true} showFirstDropDown={"none"} />
        oldMenu.unshift(newElement)
      }
      oldMenu.unshift(constantInputElement)
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
        this.buildQueryAndChangeDropdown(relation, [["CAN_PAY_ORDER", "Order constant", "Order variable"], ["CAN_PAY_ORDER", "Product constant", "Product variable"]])
        return true
      case 'KNOWS':
        this.buildQueryAndChangeDropdown(relation, [["CAN_PAY_ORDER", "KNOWS", "Customer constant", "Customer variable"], ["CAN_PAY_ORDER", "KNOWS", "Customer constant", "Customer variable"]])
        return true
      case 'CAN_PAY_PRODUCT':
        this.buildQueryAndChangeDropdown(relation, [["Product constant", "Product variable"], ["Customer constant", "Customer variable"]])
        return true
      case 'CAN_PAY_ORDER':
        this.buildQueryAndChangeDropdown(relation, [["Order constant", "Customer variable"], ["Customer constant", "Customer variable"]])
        return true
      case '≤':
        this.buildQueryAndChangeDropdown(relation, [["Price", "Credit_limit", "Customer_id", "Integer constant", "Integer variable"], ["Price", "Credit_limit", "Customer_id", "Integer constant", "Integer variable"]])
        return true
      case '=':
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
        this.buildQueryAndChangeDropdown(relation, ["Customer constant", "Customer variable"])
        return true
      case 'Customer_id':
        this.buildQueryAndChangeDropdown(relation, ["Customer constant", "Customer variable"])
        return true
      case 'Name':
        this.buildQueryAndChangeDropdown(relation, ["Customer constant", "Customer variable"])
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
        parameters.push("test const")
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
    const constElement = <OneParameterDropdownMenu key={constant} context={constant} parameters={parameters} handleParameters={this.handleParameters} acceptDropdown={true} />
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

  handleVariables = (variable, context) => {
    let parameters = []
    // eslint-disable-next-line default-case
    switch (variable) {
      case 'Customer variable':
        parameters.push("test var")
        break
      case 'Product variable':
        parameters.push("test var")
        break
      case 'Order variable':
        parameters.push("test var")
        break
      case 'Integer variable':
        parameters.push("test var")
        break
      case 'String variable':
        parameters.push("test var")
        break
    }
    const varElement = <OneParameterDropdownMenu key={variable} context={variable} parameters={parameters} handleParameters={this.handleParameters} acceptDropdown={true} />
    this.setState((prevState) => {
      let menu = prevState.dropdownMenu
      const element = menu.shift()
      if (element.type.name === "TwoParametersDropdownMenu" && element.props["acceptSecondDropdown"] === false) {
        const newElement = <TwoParametersDropdownMenu key={element.key} context={element.props["context"]} parameters1={element.props["parameters1"]} parameters2={element.props["parameters2"]}
          handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={true} showFirstDropDown={"none"} />
        menu.unshift(newElement)
      }
      menu.unshift(varElement)
      return {
        dropdownMenu: menu
      }
    })
  }

  handleParameters = (parameter, index, max_index, context) => {
    if (parameter.includes("constant")) {
      if (parameter.includes("Integer") || parameter.includes("String")) {
        this.createFreeInput()
      } else {
        this.handleConstants(parameter, context)
      }
    } else if (parameter.includes("variable")) {
      this.createFreeInput()
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

  render() {
    const mainDropdownMenu = <Dropdown style={{ paddingLeft: "1px", marginTop: '-7px' }}>
      <Dropdown.Toggle variant="link" id="dropdown-query-options" disabled={this.state.acceptAND}>
        Add predicate
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {this.state.acceptedRelations.map((relation, i) => {
          return <Dropdown.Item key={i} action="true" onClick={this.handleNextRelationSelection.bind(this, relation)}>{relation}</Dropdown.Item>
        })}
      </Dropdown.Menu>
    </Dropdown>

    return (<Container style={{ margin: "5px" }} fluid="true">
      <Row style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px" }}>
        <Col xl={1}>
          <Row style={{ marginTop: '5px' }}>
            <h4> Query: </h4>
          </Row>
        </Col>
        <Col>
          <Row style={style.basicComponentsStyle}>
            <Row style={{ marginLeft: "10px", marginTop: "5px", fontFamily: "Lucida Console, Monaco, monospace" }}>
              {this.state.query}
              {this.state.dropdownMenu.length === 0 ? mainDropdownMenu : this.state.dropdownMenu.map((element, i) => {
                if (i === 0) {
                  if (element.type.name === "OneParameterDropdownMenu") {
                    return <OneParameterDropdownMenu key={element.key} context={element.props["context"]} parameters={element.props["parameters"]} handleParameters={this.handleParameters} acceptDropdown={true} />
                  } else if (element.type.name === "TwoParametersDropdownMenu") {
                    return <TwoParametersDropdownMenu key={element.key} context={element.props["context"]} parameters1={element.props["parameters1"]} parameters2={element.props["parameters2"]}
                      handleParameters={this.handleParameters} acceptFirstDropdown={true} acceptSecondDropdown={element.props["acceptSecondDropdown"]}
                      showFirstDropDown={element.props["showFirstDropDown"]} />
                  }
                }
                return element
              })}
            </Row>
          </Row>
        </Col>
      </Row>
      <Row style={{ margin: "5px" }}>
        <div style={{ marginLeft: "5px", marginRigth: "5px" }}>
          <Button variant="dark" onClick={this.addAnd} disabled={!this.state.acceptAND}>Add AND</Button>
        </div>
        <div style={{ marginLeft: "5px", marginRigth: "5px" }}>
          <Button variant="dark" onClick={this.emptyQuery}>Delete all</Button>
        </div>
        <div style={{ marginLeft: "5px", marginRigth: "5px" }}>
          <Button variant="dark" onClick={this.submitQuery}>Execute query</Button>
        </div>
      </Row>
    </Container>
    )
  }
}

export default QueryComponent