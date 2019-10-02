import React, { Component } from 'react'
import './App.css'
import style from './styles'
import store from './store'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import StatBox from './components/StatBox'
import NodeDataTextField from './components/NodeDataTextField'
import FreeTextInputQueryComponent from './components/queryComponents/FreeTextInputQueryComponent'
import NavigationBarComponent from './components/NavigationBarComponent'
import SchemaComponent from './components/SchemaComponent'
import NotificationComponent from './components/NotificationComponent'
import Notification from './actions/NotificationAction'
import ResultComponent from './components/ResultComponent'
import foldQuery from './services/foldHaskellBasedQueryParser'
import PopUpComponent from './components/PopUpComponent'
import ExampleQueryComponent from './components/ExampleQueryComponent'
import examples from './examples.json'
import unibenchPatentDataExamples from './unibenchPatentDataExamples.json'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: "", showedNodeData: { data: [{ "key": undefined, "value": undefined }] },
			width: window.innerWidth, height: window.innerHeight, notification: "",
			queryResultModel: "", relationalResult: undefined, relationalKey: "initialRelationalKey",
			graphResult: undefined, graphKey: "initialGraphKey", treeResult: undefined, treeKey: "initialTreeKey", showPopup: false
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
	}

	componentDidMount() {
		this.updateWindowDimensions()
		window.addEventListener('resize', this.updateWindowDimensions)
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions)
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight })
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

	handleQueryChange = (event) => {
		this.setState({ query: event.target.value })
	}

	togglePopup() {
		this.setState((prevState) => { return { showPopup: !prevState.showPopup } })
	}

	handleStoreChange = () => {
		if (this.state.showedNodeData !== store.getState().nodeData) {
			this.setState({
				showedNodeData: store.getState().nodeData
			})
		}
	}

	handleExampleQuery = (exampleQuery) => {
		this.setState({ query: exampleQuery })
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
					Notification.notify("Error in expressing the relational result.", "warning")
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
					Notification.notify("Error in expressing the graph result.", "warning")
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
					Notification.notify("Error in expressing the tree result.", "warning")
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

	render() {
		store.subscribe(this.handleStoreChange)

		return (
			<Container style={{ backgroundColor: "#f1f1f2", minHeight: this.state.height }} fluid='true'>
				<NavigationBarComponent />
				<Container fluid='true'>
					<FreeTextInputQueryComponent togglePopup={this.togglePopup.bind(this)} handleQueryChange={this.handleQueryChange} handleQuery={this.handleQuery} query={this.state.query} />
					<NotificationComponent />
					<Row style={style.basicComponentsStyle}>
						<ExampleQueryComponent header = {"Simple demo data examples"} examples = {examples} handleExampleQuery={this.handleExampleQuery} />
					</Row>
					<Row style={style.basicComponentsStyle}>
						<ExampleQueryComponent header = {"UDMS Dataset Patent data examples (contain bugs)"} examples = {unibenchPatentDataExamples} handleExampleQuery={this.handleExampleQuery} />
					</Row>
					<Row>
						<Col xl={6}>
							<SchemaComponent width={this.state.width} height={this.state.height} />
						</Col>
						<Col xl={6}>

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