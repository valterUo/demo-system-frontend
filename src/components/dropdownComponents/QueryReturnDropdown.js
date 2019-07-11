import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Row from 'react-bootstrap/Row'
import info from '../dropdownComponents/SchemaInfoForDropdowns.json'

class QueryReturnDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initialText: "", returnValues: [], selectedValue: undefined
        }
    }

    selectVariable = (variableElement) => {
        console.log(variableElement)
        let element
        info.nodes.map(node => {
            if (node.name === variableElement.type) {
                element = node
            }
            return node
        })
        let tempReturnValues = []
        tempReturnValues.push(variableElement.variable)
        element.leavingArrows.map(element => tempReturnValues.push(element + "(" + variableElement.variable + ")"))
        this.setState({
            returnValues: tempReturnValues,
            initialText: "Choose attribute of " + variableElement.variable
        })
    }

    selectingReturnValue = (value) => {
        this.props.selectReturnValue(value)
        this.setState({
            selectedValue: value
        })
    }

    render() {
        let renderedContent
        if (this.state.selectedValue === undefined) {
            renderedContent = <ButtonGroup>
                <Dropdown style={{ marginTop: '-7px' }}>
                    <Dropdown.Toggle variant="link" id="dropdown-QueryReturnDropdown-options" style={{ paddingRight: "0px", paddingLeft: "0px" }}>
                        {this.state.initialText === "" ? "Choose variable or its attribute" : this.state.initialText}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {this.state.returnValues.length === 0 ? this.props.savedVariables.map((variableElement, i) => {
                            return <Dropdown.Item key={i} action="true" onClick={this.selectVariable.bind(this, variableElement)}>
                                {variableElement.variable + ": " + variableElement.type + " variable"}
                            </Dropdown.Item>
                        }) : this.state.returnValues.map((value, i) => {
                            return <Dropdown.Item key={i} action="true" onClick={this.selectingReturnValue.bind(this, value)}>
                                {value}
                            </Dropdown.Item>
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </ButtonGroup>
        } else {
            renderedContent = this.state.selectedValue
        }

        return <Row style={{ marginLeft: "10px", marginTop: "5px", marginBottom: "5px", paddingLeft: "15px", fontFamily: "Lucida Console, Monaco, monospace" }}>
            <b>Return&nbsp;</b>
            {this.props.savedVariables.length === 0 ? "(No variables in the query)"
                : renderedContent}
        </Row>
    }
}

export default QueryReturnDropdown