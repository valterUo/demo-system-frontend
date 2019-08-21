import React, { Component } from 'react'
import style from '../styles'
import Dropdown from 'react-bootstrap/Dropdown'
import examples from '../examples'

class ExampleQueryComponent extends Component {

    render() {
        return <div style={style.queryButtonStyle}>
        <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                Select example query
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {examples.examples.map((example, i) => <Dropdown.Item key={`${i}`} eventKey={`${i}`} onClick={() => this.props.handleExampleQuery(example)}>Example {`${i}`}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    </div>
    }
}
export default ExampleQueryComponent