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
        let file = this.file
        const name = file.current.files[0].name
        const variableName = this.state.dataSet.name
        await FileSender.sendFiles(file.current.files[0], name, variableName, this.state.dataSet["loadingFunction"], this.handleUploadProgressChange)
        setTimeout(() => this.setState({ progress: -1 }), 3000)
    }

    handleUploadProgressChange = (progress) => {
        this.setState({ progress: progress })
    }

    render() {
        return <Container style={{ margin: "5px" }} fluid="true">
            <Col style={{ marginLeft: "5px", marginRigth: "5px" }}>
                <Row>
                    <Col>
                        <Row style={{ marginTop: '5px' }}>
                            <h4>Upload data</h4>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Dropdown style={{ marginTop: "20px" }}>
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