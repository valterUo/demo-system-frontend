import React, { Component } from 'react'
import style from '../styles'
import Dropdown from 'react-bootstrap/Dropdown'

class ExampleQueryTypeComponent extends Component {

    render() {
        return <div style={style.queryButtonStyle}>
            <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    {this.props.header}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {this.props.examples.map((example, i) => <Dropdown.Item key={`${i}`} eventKey={`${i}`} onClick={() => this.props.handleExampleQuery(example)}>Example {`${i}`}</Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    }
}

export default ExampleQueryTypeComponent