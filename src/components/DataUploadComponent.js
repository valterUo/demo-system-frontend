import React, { Component } from 'react'
import FileSender from '../services/sendFiles'
import Row from 'react-bootstrap/Row'
import UploadForm from './UploadForm'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import ProgressBar from './ProgressBar'
import Dropdown from 'react-bootstrap/Dropdown'

class DataUploadComponent extends Component {
    constructor(props) {
        super(props)
        this.file = React.createRef()
        this.state = { dataSet: undefined, progress: -1, uploading: false }
    }

    handleDatasetChange = (datasetIndex) => {
        this.setState({ dataSet: this.props.uploadInfo[datasetIndex] })
    }

    setFile = (file) => {
        this.file = file
    }

    handleFileSubmit = async () => {
        let files = this.file.current.files
        console.log(files)
        let fileNames = ""
        let i
        console.log(files.length)
        for (i = 0; i < files.length; i++) {
            if (i === 0) {
                fileNames = files[i].name
            } else {
                fileNames = files[i].name + ";" + fileNames
            }
        }
        console.log(fileNames)
        const variableName = this.state.dataSet.name
        await this.processFiles(files)
        await FileSender.sendFiles(files[files.length - 1], files[files.length - 1].name, fileNames, variableName, this.state.dataSet["loadingFunction"], this.handleUploadProgressChange)
        setTimeout(() => this.setState({ progress: -1 }), 3000)
    }

    processFiles = async (files) => {
        let i = 0
        for (const file of files) {
            if (i < files.length - 1) {
                i++
                await FileSender.sendFileWithoutUsingIt(file, file.name, this.handleUploadProgressChange)
            }
        }
    }

    handleUploadProgressChange = (progress) => {
        this.setState({ progress: progress })
    }

    render() {
        return <Container style={{ margin: "5px" }} fluid="true">
            <Col style={{ marginLeft: "5px", marginRigth: "5px" }}>
                <Row>
                    <Col>
                        <h4>Upload data</h4>
                    </Col>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle variant="dark" id="dropdown-collection">
                                Select collection
                    </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    this.props.uploadInfo.map((element, i) => <Dropdown.Item eventKey="e0" key={i} onClick={this.handleDatasetChange.bind(this, i)}>{element.name}</Dropdown.Item>)
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                <Row>
                    {this.state.dataSet === undefined ? null : <Col>
                        <UploadForm setFile={this.setFile} id={"fileupload"} name={"fileInput"} handleFileSubmit={this.handleFileSubmit} header={"Select file for " + this.state.dataSet["name"]} />
                        {
                            this.state.progress > -1 ? <Row>
                                <ProgressBar progress={this.state.progress} />
                            </Row> : null
                        }
                    </Col>}
                </Row>
            </Col>
        </Container>
    }
}

export default DataUploadComponent