import React, { Component } from 'react'
//import FileSender from '../services/sendFiles'
//import style from '../styles'
import Row from 'react-bootstrap/Row'
//import Notification from '../actions/NotificationAction'
import UploadForm from './UploadForm'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

class DataUploadComponent extends Component {
    constructor(props) {
        super(props)
        this.relationalFile = React.createRef()
        this.xmlFile = React.createRef()
        this.graphFile = React.createRef()
    }

    handleFileSubmit = async (event) => {
        event.preventDefault()
        //const name = this.file.current.files[0].name
        //await FileSender.sendFiles(this.file.current.files[0], name)
        //Notification.notify("File " + name + " uploaded!", "success")
    }

    render() {
        return <Container style={{ margin: "5px" }} fluid="true">
            <Row style={{ marginBottom: "5px", marginLeft: "5px", marginRigth: "5px" }}>
                <Col xl={1}>
                    <Row style={{ marginTop: '5px' }}>
                        <h4>Upload data</h4>
                    </Row>
                </Col>
                <Row style={{ "margin": "10px" }}>
                    <UploadForm fileRef={this.relationalFile} handleFileSubmit={this.handleFileSubmit} header={"Relational data"} />
                    <UploadForm fileRef={this.xmlFile} handleFileSubmit={this.handleFileSubmit} header={"XML data"} />
                    <UploadForm fileRef={this.graphFile} handleFileSubmit={this.handleFileSubmit} header={"Graph data"} />
                </Row>
            </Row>
        </Container>
    }
}

export default DataUploadComponent