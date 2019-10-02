import React, { Component } from 'react'
import style from '../styles'
import ExampleQueryTypeComponent from './ExampleQueryTypeComponent'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'

class ExampleQueryComponent extends Component {

    render() {
        return <div style={style.queryButtonStyle}>
            <h4>{this.props.header}</h4>
            <ButtonToolbar>
        {this.props.examples.examples.map((exampleCase, i) => 
            <ExampleQueryTypeComponent key={`${i}`} header = {exampleCase["header"]} examples={exampleCase["examples"]} handleExampleQuery = {this.props.handleExampleQuery}/>)}
        </ButtonToolbar>
    </div>
    }
}
export default ExampleQueryComponent