import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

class TwoParametersDropdownMenu extends Component {

    render() {
        let acceptFirstDropdown = true
        if (this.props.showFirstDropDown === "none") {
            acceptFirstDropdown = false
        }
        return <ButtonGroup>
            <Dropdown className="firsDropdown" style={{ marginTop: '-7px', marginLeft: "4px", display: this.props.showFirstDropDown }}>
                <Dropdown.Toggle variant="link" id="dropdown-parameter1-options" style={{ paddingRight: "0px", paddingLeft: "0px" }}
                    disabled={!acceptFirstDropdown}>
                    Parameter
    </Dropdown.Toggle>
                <Dropdown.Menu>
                    {this.props.parameters1.map((parameter, i) => <Dropdown.Item key={i} action="true" onClick={this.props.handleParameters.bind(this, parameter, 1, 2, this.props.context)}>
                        {parameter}
                    </Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>
            {this.props.showFirstDropDown === "none" ? " " : ", "}
            <Dropdown style={{ marginTop: '-7px' }}>
                <Dropdown.Toggle variant="link" id="dropdown-parameter2-options" style={{ paddingRight: "0px" }} disabled={!this.props.acceptSecondDropdown}>
                    Parameter
    </Dropdown.Toggle>
                <Dropdown.Menu >
                    {this.props.parameters2.map((parameter, i) => <Dropdown.Item key={i} action="true" onClick={this.props.handleParameters.bind(this, parameter, 2, 2, this.props.context)}>
                        {parameter}
                    </Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>
        </ButtonGroup>
    }
}

export default TwoParametersDropdownMenu