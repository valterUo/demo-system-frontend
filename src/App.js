import React, { Component } from 'react'
import './App.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import data3 from './exampleData/data3.json'
import StatBox from './components/StatBox'
import NodeDataTextField from './components/NodeDataTextField'
import store from './store'
import FileSubmitComponent from './components/FileSubmitComponent'
import NavigationBarComponent from './components/NavigationBarComponent'
import SchemaComponent from './components/SchemaComponent'
import style from './styles'
import ResultComponent from './components/ResultComponent'
import MLQueryComponent from './components/MLQueryComponent'
import ml from './services/metaLanguageCompilerService'
import NotificationComponent from './components/NotificationComponent'
import NewQueryComponent from './components/NewQueryComponent'
import DataUploadComponent from './components/DataUploadComponent'
import QueryAnswerParser from './services/queryAnswerParser'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: "", showedNodeData: { data: [{ "key": undefined, "value": undefined }] }, schemaData: data3, schemaKey: "", nodeName: undefined, linkName: undefined,
			nameClass: undefined, queryAnswers: [], sourceFunction: undefined, targetFunction: undefined,
			queryMode: "", width: window.innerWidth, height: window.innerHeight, mlSchemaData: {}, notification: "", currentConstant: "", queryResultKey: "", queryResultModel: ""
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
	}

	componentDidMount() {
		this.updateWindowDimensions()
		window.addEventListener('resize', this.updateWindowDimensions)
		store.dispatch({ type: 'ADD_SCHEMA_DATA', data: data3, key: "" })
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions)
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight })
	}

	handleQuery = async (event) => {
		event.preventDefault()
		const answer = await ml.compile(this.state.query)
		if (answer.data.includes("customer")) {
			this.setState(state => {
				let data = QueryAnswerParser.queryAnswerParser(answer.data.replace('\n-', '').trim(), ["id", "name", "Credit limit"], "graph")
				return {
					queryResultData: data
				}
			})
		}
		this.setState(state => {
			const newAnswer = answer.data.replace('\n-', '').trim()
			const newAnswers = [...state.queryAnswers, newAnswer]
			return { queryAnswers: newAnswers }
		})
		this.setState({ query: "" })
	}

	handleQueryChange = (event) => {
		this.setState({ query: event.target.value })
	}

	handleSourceFunctionChange = (event) => {
		this.setState({ sourceFunction: event.target.value })
	}

	handleTargetFunctionChange = (event) => {
		this.setState({ targetFunction: event.target.value })
	}

	handleSourceTargetSubmit = (event) => {
		event.preventDefault()
		if (this.state.targetFunction !== undefined && this.state.sourceFunction !== undefined) {
			this.setState({ mlSchemaData: { source: this.state.sourceFunction, target: this.state.targetFunction } })
		}
	}

	handleStoreChange = () => {
		if (this.state.showedNodeData !== store.getState().nodeData) {
			this.setState({
				showedNodeData: store.getState().nodeData
			})
		}
		if (store.getState().schemaData.key !== this.state.schemaKey) {
			this.setState({
				schemaData: store.getState().schemaData.schema,
				schemaKey: store.getState().schemaData.key
			})
		}
		if (store.getState().queriedDemoData.key !== this.state.queryResultKey) {
			this.setState({
				queryResultData: store.getState().queriedDemoData.data,
				queryResultKey: store.getState().queriedDemoData.key,
				queryResultModel: store.getState().queriedDemoData.model
			})
		}
	}

	handleFunctionDefinition() {
		this.setState({ queryMode: "Source and target function", acceptFunctions: true })
	}

	handleMLcompiler() {
		this.setState({ queryMode: "ML code compiler", acceptFunctions: false })
	}

	render() {
		store.subscribe(this.handleStoreChange)

		return (
			<Container style={{ backgroundColor: "#f1f1f2", minHeight: this.state.height }} fluid='true'>
				<NavigationBarComponent />
				<Container fluid='true'>
					<Row style={style.basicComponentsStyle}>
						<Col xl={1}>
							<h4 align="right">Input</h4>
						</Col>
						<Col xl={2}>
							<Dropdown style={{ marginTop: "4px" }}>
								<Dropdown.Toggle variant="light" id="dropdown-query-mode">
									{this.state.queryMode === "" ? "Query mode" : this.state.queryMode}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item action="true" variant="primary" onClick={() => this.handleMLcompiler()}>ML code compiler</Dropdown.Item>
									<Dropdown.Item action="true" variant="primary" onClick={() => this.handleFunctionDefinition()}>Source and target</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</Col>
						<Col xl={7} style={{ align: "left" }}>
							{!this.state.acceptFunctions && <Form onSubmit={this.handleQuery} inline>
								<Form.Control as="textarea" rows="1" placeholder="Enter query or choose defined query" value={this.state.query} onChange={this.handleQueryChange} style={{ width: "90%", marginRight: "5px" }} />
								<Button type="submit" variant="dark"> <i className='fas fa-play' style={{ fontSize: '24px', marginTop: "4px" }}></i> </Button>
							</Form>}
							{this.state.acceptFunctions && <Form onSubmit={this.handleSourceTargetSubmit} inline>
								<Form.Control as="textarea" rows="1" placeholder="Enter source function" value={this.state.sourceFunction} onChange={this.handleSourceFunctionChange} style={{ width: "45%", marginRight: "5px" }} />
								<Form.Control as="textarea" rows="1" placeholder="Enter target function" value={this.state.targetFunction} onChange={this.handleTargetFunctionChange} style={{ width: "45%", marginRight: "5px" }} />
								<Button type="submit" variant="dark"> <i className='fas fa-play' style={{ fontSize: '24px', marginTop: "4px" }}></i> </Button>
							</Form>}
						</Col>
						<Col xl={2}>
							<FileSubmitComponent />
						</Col>
					</Row>
					<NotificationComponent />
					<Row style={style.basicComponentsStyle}>
						<DataUploadComponent />
					</Row>
					<Row style={style.basicComponentsStyle}>
						<NewQueryComponent />
					</Row>
					<Row>
						<Col xl={6}>
							<SchemaComponent width={this.state.width} height={this.state.height} schemaKey={this.state.schemaKey} schemaData={this.state.schemaData}
								schemaVisible={this.state.schemaVisible} mlSchemaData={this.state.mlSchemaData} />
						</Col>
						<Col xl={6}>
							<MLQueryComponent answers={this.state.queryAnswers} />

							<ResultComponent width={this.state.width} height={this.state.height} queryResultData={this.state.queryResultData} resultModel={this.state.queryResultModel}
								resultKey={"resultKey" + this.state.queryResultKey} nodeName={"resultNodes" + this.state.queryResultKey} linkName={"resultLinks" + this.state.queryResultKey} nameClass={"resultClass" + this.state.queryResultKey} />

							<Row style={style.basicComponentsStyle}>
								<StatBox data={this.state.showedNodeData} />
							</Row>
							<NodeDataTextField />
						</Col>
					</Row>
				</Container>
			</Container>
		)
	}
}

export default App