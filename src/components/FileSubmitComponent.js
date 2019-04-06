import React, { Component } from 'react'
import FileSender from '../services/sendFiles'
import style from '../styles'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class FileSubmitComponent extends Component {
    constructor(props) {
        super(props)
        this.file = React.createRef()
    }

    handleFileSubmit = async (event) => {
        event.preventDefault()
        console.log('file submitted')
        console.log(this.file.current.files[0].name)
        const answer = await FileSender.sendFiles(this.file.current.files[0], this.file.current.files[0].name)
        console.log(answer)
    }

    render() {
        return <Form onSubmit={this.handleFileSubmit}>
            <label style={style.fileInputLabelStyle} htmlFor="fileInput">{"Select files"}</label>
            <input name="fileInput" id="fileInput" style={style.fileInputStyle} as='input' type="file" multiple="multiple" ref={this.file} />
            <Button type="submit" value="Submit" variant="dark"><i className='fas fa-upload' style={{ 'fontSize': '24px' }}></i></Button>
        </Form>
    }
}
export default FileSubmitComponent