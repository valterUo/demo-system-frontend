import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

class MainDropdownMenu extends Component {

    render() {
        return <Dropdown style={{ paddingLeft: "1px", marginTop: '-7px' }}>
            <Dropdown.Toggle variant="link" id="dropdown-query-options" disabled={this.props.acceptAND}>
                Add predicate
        </Dropdown.Toggle>
            <Dropdown.Menu>
                {this.props.acceptedRelations.map((relation, i) => {
                    return <Dropdown.Item key={i} action="true" onClick={this.props.handleNextRelationSelection.bind(this, relation, this.props.buildQueryAndChangeDropdown)}>{relation}</Dropdown.Item>
                })}
            </Dropdown.Menu>
        </Dropdown>
    }
}

export default MainDropdownMenu