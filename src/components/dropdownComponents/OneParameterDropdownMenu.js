import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

class OneParameterDropdownMenu extends Component {

    render() {
        return <ButtonGroup>
            <Dropdown style={{ marginTop: '-7px' }}>
                <Dropdown.Toggle variant="link" id="dropdown-parameter1-options" disabled={!this.props.acceptDropdown} style={{ paddingRight: "0px", paddingLeft: "0px" }}>
                    Parameter
  </Dropdown.Toggle>
                <Dropdown.Menu>
                    {this.props.parameters.map((parameter, i) => {
                        return <Dropdown.Item key={i} action="true" onClick={this.props.handleParameters.bind(this, parameter, 1, 1)}>
                            { parameter }
                        </Dropdown.Item>
                    })}
                </Dropdown.Menu>
            </Dropdown> )
  </ButtonGroup>
    }
}

export default OneParameterDropdownMenu