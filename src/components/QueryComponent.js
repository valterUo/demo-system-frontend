import React, { Component } from 'react'
import style from '../styles'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import OneParameterDropdownMenu from './dropdownComponents/OneParameterDropdownMenu'
import TwoParametersDropdownMenu from './dropdownComponents/TwoParametersDropdownMenu'


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

  handleNextRelationSelection = (relation) => {
    this.setState((prevState) => ({
      previousQuery: prevState.query,
      acceptDeletePrevious: true
    }))
    switch (relation) {
      case 'CONTAINS':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <TwoParametersDropdownMenu parameters1={["var1"]} parameters2={["var2"]}
            handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={false} showFirstDropDown={"block"} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "CONTAINS( ",
            dropdownMenu: newMenu
          }
        })
        return true
      case 'KNOWS':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <TwoParametersDropdownMenu parameters1={["var1"]} parameters2={["var2"]}
            handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={false} showFirstDropDown={"block"} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "KNOWS( ",
            dropdownMenu: newMenu
          }
        })
        return true
      case 'CAN_PAY_PRODUCT':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <TwoParametersDropdownMenu parameters1={["var1"]} parameters2={["var2"]}
            handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={false} showFirstDropDown={"block"} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "CAN_PAY_PRODUCT( ",
            dropdownMenu: newMenu
          }
        })
        return true
      case 'CAN_PAY_ORDER':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <TwoParametersDropdownMenu parameters1={["var1"]} parameters2={["var2"]}
            handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={false} showFirstDropDown={"block"} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "CAN_PAY_ORDER( ",
            dropdownMenu: newMenu
          }
        })
        return true
      case '≤':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <TwoParametersDropdownMenu key="inequality" parameters1={["var1", "constant", "Price"]} parameters2={["var2"]}
            handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={false} showFirstDropDown={"block"} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "≤( ",
            dropdownMenu: newMenu
          }
        })
        return true
      case '=':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <TwoParametersDropdownMenu parameters1={["var1"]} parameters2={["var2"]}
            handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={false} showFirstDropDown={"block"} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "=( ",
            dropdownMenu: newMenu
          }
        })
        return true
      case 'Ordered':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <OneParameterDropdownMenu parameters={["var1"]} handleParameters={this.handleParameters} acceptDropdown={false} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "Ordered( ",
            dropdownMenu: newMenu
          }
        })
        return true
      case 'Product_id':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <OneParameterDropdownMenu parameters={["var1"]} handleParameters={this.handleParameters} acceptDropdown={false} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "Product_id( ",
            dropdownMenu: newMenu
          }
        })
        return true
      case 'Customer_name':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <OneParameterDropdownMenu parameters={["var1"]} handleParameters={this.handleParameters} acceptDropdown={false} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "Customer_name( ",
            dropdownMenu: newMenu
          }
        })
        return true
      case 'Product_name':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <OneParameterDropdownMenu parameters={["var1"]} handleParameters={this.handleParameters} acceptDropdown={false} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "Product_name( ",
            dropdownMenu: newMenu
          }
        })
        return true
      case 'Order_no':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <OneParameterDropdownMenu parameters={["var1"]} handleParameters={this.handleParameters} acceptDropdown={false} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "Order_no( ",
            dropdownMenu: newMenu
          }
        })
        return true
      case 'Price':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <OneParameterDropdownMenu parameters={["PriceVar1"]} handleParameters={this.handleParameters} acceptDropdown={false} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "Price( ",
            dropdownMenu: newMenu
          }
        })
        return true
      case 'Credit_limit':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <OneParameterDropdownMenu parameters={["var1"]} handleParameters={this.handleParameters} acceptDropdown={false} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "Credit_limit( ",
            dropdownMenu: newMenu
          }
        })
        return true
      case 'Customer_id':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <OneParameterDropdownMenu parameters={["var1"]} handleParameters={this.handleParameters} acceptDropdown={false} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "Customer_id( ",
            dropdownMenu: newMenu
          }
        })
        return true
      case 'Name':
        this.setState((prevState) => {
          const newMenu = prevState.dropdownMenu
          const menucomponent = <OneParameterDropdownMenu parameters={["var1"]} handleParameters={this.handleParameters} acceptDropdown={false} />
          newMenu.unshift(menucomponent)
          return {
            query: prevState.query + "Name( ",
            dropdownMenu: newMenu
          }
        })
        return true
      default:
        return false
    }
  }

  handleParameters = (parameter, index, max_index) => {
    const value = this.handleNextRelationSelection(parameter)
    if (value && index < max_index) {
      let array = this.state.dropdownMenu
      if (array[0].type.name === "TwoParametersDropdownMenu") {
        const element = array.shift()
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
      let array = this.state.dropdownMenu
      const firstElement = array.shift()
      array.shift()
      array.unshift(firstElement)
      this.setState({
        dropdownMenu: array
      })
    } else {
      if (index < max_index) {
        this.setState((prevState) => ({
          query: prevState.query + parameter
        }))
        let array = this.state.dropdownMenu
        if (array[0].type.name === "OneParameterDropdownMenu") {
          array.shift()
        } else {
          const element = array.shift()
          const newElement = <TwoParametersDropdownMenu key={element.key} parameters1={element.props["parameters1"]} parameters2={element.props["parameters2"]}
            handleParameters={this.handleParameters} acceptFirstDropdown={false} acceptSecondDropdown={true} showFirstDropDown={"none"} />
          array.unshift(newElement)
        }
        this.setState({
          dropdownMenu: array
        })
      } else if (index === max_index) {
        let array = this.state.dropdownMenu
        const element = array.shift()
        if(element.type.name === "TwoParametersDropdownMenu") {
        if(array.length === 0) {
          console.log("one comma")
        this.setState((prevState) => ({
          query:  prevState.query + ", " + parameter + ") ",
          dropdownMenu: array,
          acceptAND: true
        }))
      } else {
        this.setState((prevState) => ({
          query: prevState.query + parameter + ") ",
          dropdownMenu: array,
          acceptAND: true
        }))
      }
    } else {
      if(array.length === 0) {
        console.log("one comma")
      this.setState((prevState) => ({
        query:  prevState.query + parameter + ") ",
        dropdownMenu: array,
        acceptAND: true
      }))
    } else {
      this.setState((prevState) => ({
        query: prevState.query + parameter + ") ",
        dropdownMenu: array,
        acceptAND: true
      }))
    }
    }
      }
    }
  }

  render() {
    const mainDropdownMenu = <Dropdown style={{ paddingLeft: "1px", marginTop: '-7px' }}>
      <Dropdown.Toggle variant="link" id="dropdown-query-options" disabled={this.state.acceptAND}>
        Next element
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
                    return <OneParameterDropdownMenu parameters={element.props["parameters"]} handleParameters={this.handleParameters} acceptDropdown={true} />
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