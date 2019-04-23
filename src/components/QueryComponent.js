import React, { Component } from 'react'
import style from '../styles'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import OneParameterDropdownMenu from './dropdownComponents/OneParameterDropdownMenu'
import TwoParametersDropdownMenu from './dropdownComponents/TwoParametersDropdownMenu'
import { initializeDropdown } from './dropdownComponents/InitializeDropDowns'


class QueryComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: "", acceptOneRelationParameter: false, acceptTwoRelationParameters: false, acceptSecondParameter: false, acceptAND: false,
      acceptedRelations: ["CONTAINS", "KNOWS", "CAN_PAY_PRODUCT", "CAN_PAY_ORDER", "Ordered", "Product_id", "Customer_name", "Product_name", "Order_no", "Price", "Credit_limit", "Customer_id", "Name", "≤", "="],
      parameters1: [],
      parameters2: [],
      dropdownMenu: []
    }
  }

  addAnd = () => {
    this.setState((prevState) => ({
      previousQuery: prevState.query,
      query: prevState.query + " AND ",
      acceptAND: false,
      acceptDeletePrevious: true
    }))
  }

  emptyQuery = () => {
    this.setState((prevState) => ({
      previousQuery: prevState.query,
      query: "",
      acceptAND: false,
      acceptDeletePrevious: false,
      dropdownMenu: []
    }))
  }

  submitQuery = () => {
    console.log(this.state.query)
  }

  buildQueryAndChangeDropdown = (relationName, parameters) => {
    this.setState((prevState) => {
      const oldMenu = prevState.dropdownMenu
      const menucomponent = initializeDropdown(relationName, parameters, this.handleParameters)
      oldMenu.unshift(menucomponent)
      return {
        query: prevState.query + relationName + "( ",
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
        this.buildQueryAndChangeDropdown(relation, [["var1"], [["var2"]]])
        return true
      case 'KNOWS':
        this.buildQueryAndChangeDropdown(relation, [["var1"], [["var2"]]])
        return true
      case 'CAN_PAY_PRODUCT':
        this.buildQueryAndChangeDropdown(relation, [["var1"], [["var2"]]])
        return true
      case 'CAN_PAY_ORDER':
        this.buildQueryAndChangeDropdown(relation, [["var1"], [["var2"]]])
        return true
      case '≤':
        this.buildQueryAndChangeDropdown(relation, [["var1", "constant", "Price"], [["var2"]]])
        return true
      case '=':
        this.buildQueryAndChangeDropdown(relation, [["var1"], [["var2"]]])
        return true
      case 'Ordered':
        this.buildQueryAndChangeDropdown(relation, ["var1"])
        return true
      case 'Product_id':
        this.buildQueryAndChangeDropdown(relation, ["var1"])
        return true
      case 'Customer_name':
        this.buildQueryAndChangeDropdown(relation, ["var1"])
        return true
      case 'Product_name':
        this.buildQueryAndChangeDropdown(relation, ["var1"])
        return true
      case 'Order_no':
        this.buildQueryAndChangeDropdown(relation, ["var1"])
        return true
      case 'Price':
        this.buildQueryAndChangeDropdown(relation, ["PriceVar1"])
        return true
      case 'Credit_limit':
        this.buildQueryAndChangeDropdown(relation, ["var1"])
        return true
      case 'Customer_id':
        this.buildQueryAndChangeDropdown(relation, ["var1"])
        return true
      case 'Name':
        this.buildQueryAndChangeDropdown(relation, ["var1"])
        return true
      default:
        return false
    }
  }

  handleParameters = (parameter, index, max_index) => {
    const value = this.handleNextRelationSelection(parameter)
    let array = this.state.dropdownMenu
    const element = array.shift()

    if (value && index < max_index) {
      if (element.type.name === "TwoParametersDropdownMenu") {
        const newElement = <TwoParametersDropdownMenu key={element.key} parameters1={element.props["parameters1"]} parameters2={element.props["parameters2"]}
          handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={true} showFirstDropDown={"none"} />
        array.unshift(newElement)
        this.setState({
          dropdownMenu: array
        })
      } else {
        console.log("Error!")
      }
    } else if (value && index === max_index) {
      array.shift()
      array.unshift(element)
      this.setState({
        dropdownMenu: array
      })
    } else {
      if (index < max_index) {
        if (element.type.name === "OneParameterDropdownMenu") {
          array.shift()
        } else {
          const newElement = <TwoParametersDropdownMenu key={element.key} parameters1={element.props["parameters1"]} parameters2={element.props["parameters2"]}
            handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={true} showFirstDropDown={"none"} />
          array.unshift(newElement)
        }
        this.setState((prevState) => ({
          query: prevState.query + parameter,
          dropdownMenu: array
        }))
      } else if (index === max_index) {
        let tempQuery = this.state.query + parameter + ") "
        if (element.type.name === "TwoParametersDropdownMenu") {
          tempQuery = this.state.query + ", " + parameter + ") "
        }
        if (array.length === 0) {
          this.setState((prevState) => ({
            query: tempQuery,
            dropdownMenu: array,
            acceptAND: true
          }))
        } else {
          this.setState((prevState) => ({
            query: prevState.query + parameter + ") ",
            dropdownMenu: array,
            acceptAND: false
          }))
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
            <Row style={{ marginLeft: "10px", marginTop: "5px" }}>
              {this.state.query}
              {this.state.dropdownMenu.length === 0 ? mainDropdownMenu : this.state.dropdownMenu.map((element, i) => {
                if (i === 0) {
                  if (element.type.name === "OneParameterDropdownMenu") {
                    return <OneParameterDropdownMenu key={element.key} parameters={element.props["parameters"]} handleParameters={this.handleParameters} acceptDropdown={true} />
                  } else {
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