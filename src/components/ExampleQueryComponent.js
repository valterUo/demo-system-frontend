import React, { Component } from 'react'
import style from '../styles'
import ExampleQueryTypeComponent from './ExampleQueryTypeComponent'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import examples from '../examples'

class ExampleQueryComponent extends Component {

    render() {
        return <div style={style.queryButtonStyle}>
            <h4>Example queries</h4>
            <ButtonToolbar>
        {examples.examples.map((exampleCase, i) => 
            <ExampleQueryTypeComponent key={`${i}`} header = {exampleCase["header"]} examples={exampleCase["examples"]} handleExampleQuery = {this.props.handleExampleQuery}/>)}
        </ButtonToolbar>
    </div>
    }
}
export default ExampleQueryComponent