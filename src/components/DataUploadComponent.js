import React, { Component } from 'react'
import FileSender from '../services/sendFiles'
//import style from '../styles'
import Row from 'react-bootstrap/Row'
import Notification from '../actions/NotificationAction'
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

    setFile = (file, type) => {
        if(type === "relational"){
            this.relationalFile = file
            console.log(file)
        } else if (type === "document") {
            this.xmlFile = file
        } else if(type === "graph") {
            this.graphFile = file
        }
    }

    handleFileSubmit = async (type) => {
        console.log(type)
        let file;
        if(type === "relational"){
            file = this.relationalFile
            console.log(file)
        } else if (type === "document") {
            file = this.xmlFile
        } else if(type === "graph") {
            file = this.graphFile
        }
        const name = file.current.files[0].name
        const address = type
        await FileSender.sendFiles(file.current.files[0], name, address)
        Notification.notify("File " + name + " uploaded!", "success")
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
                    <UploadForm setFile={this.setFile} id = {"fileupload1"} name = {"relationalFileInput"} handleFileSubmit={this.handleFileSubmit} type = {"relational"} header={"Relational data"} />
                    <UploadForm setFile={this.setFile} id = {"fileupload2"} name = {"documentFileInput"} handleFileSubmit={this.handleFileSubmit} type = {"document"} header={"XML data"} />
                    <UploadForm setFile={this.setFile} id = {"fileupload3"} name = {"graphFileInput"} handleFileSubmit={this.handleFileSubmit} type = {"graph"} header={"Graph data"} />
                </Row>
            </Row>
        </Container>
    }
}

export default DataUploadComponent