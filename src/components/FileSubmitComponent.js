import React, { Component } from 'react'
import FileSender from '../services/sendFiles'
import style from '../styles'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Notification from '../actions/NotificationAction'

class FileSubmitComponent extends Component {
    constructor(props) {
        super(props)
        this.file = React.createRef()
    }

    componentDidUpdate() {
        if(this.file.current.files[0] !== undefined) {
            Notification.notify("File " + this.file.current.files[0].name + " selected!", "success")
        }
    }

    handleFileSubmit = async (event) => {
        event.preventDefault()
        const name = this.file.current.files[0].name
        await FileSender.sendFiles(this.file.current.files[0], name)
        Notification.notify("File " + name + " uploaded!", "success")
    }

    render() {
        return <Form onSubmit={this.handleFileSubmit}>
            <label style={style.fileInputLabelStyle} htmlFor="fileInput">{"Select file"}</label>
            <input name="fileInput" id="fileInput" style={style.fileInputStyle} as='input' type="file" ref={this.file} />
            <Button type="submit" value="Submit" variant="dark"><i className='fas fa-upload' style={{ 'fontSize': '20px' }}></i></Button>
        </Form>
    }
}
export default FileSubmitComponent