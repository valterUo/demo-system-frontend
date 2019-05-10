import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

class NewOneParameterDropdownMenu extends Component {

    render() {
        if (this.props.element === undefined) {
            return <ButtonGroup>
                <Dropdown style={{ marginTop: '-7px' }}>
                    <Dropdown.Toggle variant="link" id="dropdown-parameter1-options" disabled={!this.props.acceptDropdown} style={{ paddingRight: "0px", paddingLeft: "0px" }}>
                        Parameter
  </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {this.props.parameters.map((parameter, i) => {
                            return <Dropdown.Item key={i} action="true" onClick={this.props.handleParameters.bind(this, parameter, this.props.location, this.props.relation)}>
                                {parameter}
                            </Dropdown.Item>
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </ButtonGroup>
        }
        return <div> {this.props.element}</div>
    }
}

export default NewOneParameterDropdownMenu