import React, { Component } from 'react'
import './App.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import data3 from './exampleData/data3.json'
import StatBox from './components/StatBox'
import NodeDataTextField from './components/NodeDataTextField'
import store from './store'
import FreeTextInputQueryComponent from './components/queryComponents/FreeTextInputQueryComponent'
import NavigationBarComponent from './components/NavigationBarComponent'
import SchemaComponent from './components/SchemaComponent'
import style from './styles'
import MLQueryComponent from './components/MLQueryComponent'
import NotificationComponent from './components/NotificationComponent'
import Notification from './actions/NotificationAction'
import ResultComponent from './components/ResultComponent'
import Dropdown from 'react-bootstrap/Dropdown'
import foldQuery from './services/foldHaskellBasedQueryParser'
import PopUpComponent from './components/PopUpComponent'
import examples from './examples'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: "", showedNodeData: { data: [{ "key": undefined, "value": undefined }] }, schemaData: data3, schemaKey: "", nodeName: undefined, linkName: undefined,
			nameClass: undefined, queryAnswers: [], sourceFunction: undefined, targetFunction: undefined, width: window.innerWidth, height: window.innerHeight, mlSchemaData: {}, notification: "", currentConstant: "", queryResultKey: "", queryResultModel: "",
			coreLanguage: "Haskell", relationalResult: undefined, relationalKey: "initialRelationalKey", graphResult: undefined, graphKey: "initialGraphKey", treeResult: undefined, treeKey: "initialTreeKey", showPopup: false
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
		foldQuery.parseLetInQueryBlock(this.state.query)
		let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now()
		const answer = await foldQuery.executeQuery(this.state.query)
		console.log(answer)
		switch (answer["model"]) {
			case "error":
				Notification.notify(answer["message"], "warning")
				break
			case "relational":
				if (answer["answer"] === undefined) {
					Notification.notify("Relational result is empty.", "warning")
					this.initializeRelationalResult()
				} else {
					this.initializeGraphResult()
					this.initializeTreeResult()
					this.setState({
						relationalResult: answer["answer"],
						queryResultModel: "relational",
						relationalKey: timeStampInMs
					})
				}
				break
			case "graph":
				if (answer["answer"] === undefined) {
					Notification.notify("Graph result is empty.", "warning")
					this.initializeGraphResult()
				} else {
					this.initializeRelationalResult()
					this.initializeTreeResult()
					this.setState({
						graphResult: answer["answer"],
						queryResultModel: "graph",
						graphKey: timeStampInMs
					})
				}
				break
			case "tree":
				console.log(answer["answer"])
				if (answer["answer"] === undefined) {
					Notification.notify("Tree result is empty.", "warning")
					this.initializeTreeResult()
				} else {
					this.initializeRelationalResult()
					this.initializeGraphResult()
					this.setState({
						treeResult: answer["answer"],
						queryResultModel: "tree",
						treeKey: timeStampInMs
					})
				}
				break
			default:
				Notification.notify("Unknown error! An answer to the query did not follow any model.", "warning")
				break
		}
	}

	initializeGraphResult = () => {
		this.setState({ graphResult: undefined, graphKey: "initialGraphKey" })
	}

	initializeRelationalResult = () => {
		this.setState({ relationalResult: undefined, relationalKey: "initialRelationalKey" })
	}

	initializeTreeResult = () => {
		this.setState({ treeResult: undefined, treeKey: "initialTreeKey" })
	}

	handleCoreLanguageChange = (language) => {
		this.setState({ coreLanguage: language })
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

	handleDataModelChange = (model) => {
		this.setState({ queryResultModel: model })
	}

	togglePopup() {
		this.setState((prevState) => { return { showPopup: !prevState.showPopup } })
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

	handleExampleQuery = (exampleQuery) => {
		this.setState({ query: exampleQuery })
	}

	render() {
		store.subscribe(this.handleStoreChange)

		return (
			<Container style={{ backgroundColor: "#f1f1f2", minHeight: this.state.height }} fluid='true'>
				<NavigationBarComponent />
				<Container fluid='true'>
					<FreeTextInputQueryComponent togglePopup = {this.togglePopup.bind(this)} handleQueryChange={this.handleQueryChange} handleQuery={this.handleQuery} query={this.state.query} handleDataModelChange={this.handleDataModelChange} handleCoreLanguage={this.handleCoreLanguageChange} />
					<NotificationComponent />
					<Row style={style.basicComponentsStyle}>
						<div style={style.queryButtonStyle}>
							<Dropdown>
								<Dropdown.Toggle variant="dark" id="dropdown-basic">
									Select example query
								</Dropdown.Toggle>
								<Dropdown.Menu>
									{examples.examples.map((example, i) => <Dropdown.Item key = {`${i}`} eventKey = {`${i}`} onClick={() => this.handleExampleQuery(example)}>Example {`${i}`}</Dropdown.Item>)}
								</Dropdown.Menu>
							</Dropdown>
						</div>
					</Row>
					<Row>
						<Col xl={6}>
							<SchemaComponent width={this.state.width} height={this.state.height} schemaKey={this.state.schemaKey} schemaData={this.state.schemaData}
								schemaVisible={this.state.schemaVisible} mlSchemaData={this.state.mlSchemaData} />
						</Col>
						<Col xl={6}>
							<MLQueryComponent answers={this.state.queryAnswers} />
							<ResultComponent queryResultModel={this.state.queryResultModel} relationalKey={this.state.relationalKey}
								relationalResult={this.state.relationalResult} graphKey={this.state.graphKey} graphResult={this.state.graphResult}
								treeResult={this.state.treeResult} treeKey={this.state.treeKey}
								width={this.state.width} height={this.state.height} />
							<Row style={style.basicComponentsStyle}>
								<StatBox data={this.state.showedNodeData} />
							</Row>
							<NodeDataTextField />
						</Col>
					</Row>
				</Container>
				{this.state.showPopup ? <PopUpComponent closePopup={this.togglePopup.bind(this)} /> : null}
			</Container>
		)
	}
}

export default App