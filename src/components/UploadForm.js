import React, { Component } from 'react'
import style from '../styles'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class UploadForm extends Component {
    constructor(props) {
        super(props)
        this.file = React.createRef()
    }

    handleFormSubmit = (event) => {
        event.preventDefault()
        console.log(this.file.current.files)
        this.props.setFile(this.file)
        this.props.handleFileSubmit()
    }

    render() {
        return <Form onSubmit={this.handleFormSubmit} style = {{ "margin": "5px", "display": "inline-block" }}>
            <h5>{ this.props.header }</h5>
            <label style={style.fileInputLabelStyle} htmlFor = {this.props.id}>{ "Select file" }</label>
            <input name={this.props.name} id={this.props.id} style={style.fileInputStyle} as='input' type="file" ref={this.file} multiple />
            <Button type="submit" value="Submit" variant="dark"><i className='fas fa-upload' style={{ 'fontSize': '20px' }}></i></Button>
        </Form>
    }
}

export default UploadForm