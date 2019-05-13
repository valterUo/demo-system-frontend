import React, { Component } from 'react'
import style from '../styles'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class UploadForm extends Component {

    componentDidMount() {
        console.log(this.props.fileRef.current.files.length)
    }

    render() {
        return <Form onSubmit={this.props.handleFileSubmit} style = {{"margin": "5px", "display": "inline-block"}}>
            <h5>{ this.props.header }</h5>
            <label style={style.fileInputLabelStyle} htmlFor="fileInput">{"Select file"}</label>
            <input name="fileInput" id="fileInput" style={style.fileInputStyle} as='input' type="file" ref={this.props.fileRef} />
            <Button type="submit" value="Submit" variant="dark"><i className='fas fa-upload' style={{ 'fontSize': '20px' }}></i></Button>
        </Form>
    }
}

export default UploadForm