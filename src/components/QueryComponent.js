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
    const constants = this.state.savedConstants
    const variables = this.state.savedVariables
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

  handleConstantInputChange = (event) => {
    this.currentConstant = this.currentConstant + event.target.value
  }

  handleConstantInput = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault()
      const constant = this.currentConstant.value
      this.setState((prevState) => {
        let oldMenu = prevState.dropdownMenu
        oldMenu.shift()
        const element = oldMenu.shift()
        let oldConstants = prevState.savedConstants
        oldConstants.push(constant)
        let newElement
        if (element !== undefined) {
          if (element.type.name === "OneParameterDropdownMenu") {
            newElement = <OneParameterDropdownMenu key={element.key} parameters={element.props["parameters"]} handleParameters={this.handleParameters} acceptDropdown={true} />
          } else if (element.type.name === "TwoParametersDropdownMenu") {
            newElement = <TwoParametersDropdownMenu key={element.key} parameters1={element.props["parameters1"]} parameters2={element.props["parameters2"]}
              handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={true} showFirstDropDown={"none"} />
          }
          oldMenu.unshift(newElement)
          if (this.commaParanthesisList[this.commaParanthesisList.length - 1] === ", ") {
            console.log("elemenent defined 1")
            return {
              query: prevState.query + constant + this.commaParanthesisList.pop(),
              dropdownMenu: oldMenu,
              savedConstants: oldConstants
            }
          }
          console.log("elemenent defined 2")
          let paranthesis
          this.commaParanthesisList.map(element => paranthesis += element)
          this.commaParanthesisList = []
          return {
            query: prevState.query + constant + paranthesis,
            dropdownMenu: oldMenu,
            savedConstants: oldConstants
          }
        } else {
          console.log("element not defined")
          let paranthesis
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

  createNewConstant = () => {
    let paranthesis = ""
    if (this.commaParanthesisList[this.commaParanthesisList.length - 1] === ", ") {
      paranthesis = ", "
    } else {
      this.commaParanthesisList.map(element => paranthesis += element)
    }

    let constantInputElement =
      <Form inline key="constantInputForm" name="constantInput" style={{ paddingLeft: "3px", paddingRight: "3px", marginBottom: "4px" }}>
        <Form.Control key="constantInput" type="text" size='sm' placeholder="Constant" ref={input => this.currentConstant = input} onKeyDown={this.handleConstantInput.bind(this)} />{paranthesis}
      </Form>

    this.setState((prevState) => {
      let oldMenu = prevState.dropdownMenu
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
        this.buildQueryAndChangeDropdown(relation, [["Order", "New constant"], ["Product", "New constant"]])
        return true
      case 'KNOWS':
        this.buildQueryAndChangeDropdown(relation, [["Customer", "New constant"], ["Customer", "New constant"]])
        return true
      case 'CAN_PAY_PRODUCT':
        this.buildQueryAndChangeDropdown(relation, [["Product", "New constant"], ["Customer", "New constant"]])
        return true
      case 'CAN_PAY_ORDER':
        this.buildQueryAndChangeDropdown(relation, [["Order", "New constant"], ["Customer", "New constant"]])
        return true
      case '≤':
        this.buildQueryAndChangeDropdown(relation, [["var1", "New constant", "Price", "Credit_limit", "Customer_id"], ["var2", "New constant", "Price", "Credit_limit", "Customer_id"]])
        return true
      case '=':
        this.buildQueryAndChangeDropdown(relation, [["Price", "Credit_limit", "Customer_id", "New constant"], ["Price", "Credit_limit", "Customer_id", "New constant"]])
        return true
      case 'Ordered':
        this.buildQueryAndChangeDropdown(relation, ["Order", "New constant"])
        return true
      case 'Product_id':
        this.buildQueryAndChangeDropdown(relation, ["Product", "New constant"])
        return true
      case 'Customer_name':
        this.buildQueryAndChangeDropdown(relation, ["Customer", "New constant"])
        return true
      case 'Product_name':
        this.buildQueryAndChangeDropdown(relation, ["Product", "New constant"])
        return true
      case 'Order_no':
        this.buildQueryAndChangeDropdown(relation, ["Order", "New constant"])
        return true
      case 'Price':
        this.buildQueryAndChangeDropdown(relation, ["Product", "New constant"])
        return true
      case 'Credit_limit':
        this.buildQueryAndChangeDropdown(relation, ["Customer", "New constant"])
        return true
      case 'Customer_id':
        this.buildQueryAndChangeDropdown(relation, ["Customer", "New constant"])
        return true
      case 'Name':
        this.buildQueryAndChangeDropdown(relation, ["Customer", "New constant"])
        return true
      default:
        return false
    }

  }

  handleParameters = (parameter, index, max_index) => {
    const value = this.handleNextRelationSelection(parameter)
    let array = this.state.dropdownMenu
    const element = array.shift()
    const newElement = <TwoParametersDropdownMenu key={element.key} parameters1={element.props["parameters1"]} parameters2={element.props["parameters2"]}
      handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={true} showFirstDropDown={"none"} />

    if (parameter === "New constant") {
      this.createNewConstant()
    }

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

        if (parameter === "New constant") {
          this.setState((prevState) => ({
            query: prevState.query,
            dropdownMenu: array
          }))
        } else {
          this.setState((prevState) => ({
            query: prevState.query + parameter + this.commaParanthesisList.pop(),
            dropdownMenu: array
          }))
        }

      } else if (index === max_index) {
        let tempQuery
        if (parameter === "New constant") {
          tempQuery = this.state.query
        } else {

          tempQuery = this.state.query + parameter

          if (this.commaParanthesisList.length > 0) {
            tempQuery = tempQuery + this.commaParanthesisList.pop()
          }

          if (element.type.name === "TwoParametersDropdownMenu") {
            if (this.commaParanthesisList.length > 0) {
              tempQuery = tempQuery + this.commaParanthesisList.pop()
            }
            if (parameter === "New constant") {
              if (this.commaParanthesisList.length > 0) {
                tempQuery = this.state.query + this.commaParanthesisList.pop()
              }
            }
          }

          if (element.type.name === "OneParameterDropdownMenu") {
            if (this.commaParanthesisList.length > 0) {
              tempQuery = tempQuery + this.commaParanthesisList.pop()
            }
          }
        }

        this.setState({
          query: tempQuery,
          dropdownMenu: array
        })

        if (array.length === 0) {
          this.setState({
            acceptAND: true
          })
        } else {
          this.setState({
            acceptAND: false
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
                    return <OneParameterDropdownMenu key={element.key} parameters={element.props["parameters"]} handleParameters={this.handleParameters} acceptDropdown={true} />
                  } else if (element.type.name === "TwoParametersDropdownMenu") {
                    return <TwoParametersDropdownMenu key={element.key} parameters1={element.props["parameters1"]} parameters2={element.props["parameters2"]}
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