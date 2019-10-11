import React, { Component } from 'react'
import './App.css'
import style from './styles'
import store from './store'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import StatBox from './components/StatBox'
import NodeDataTextField from './components/NodeDataTextField'
import FreeTextInputQueryComponent from './components/queryComponents/FreeTextInputQueryComponent'
import NavigationBarComponent from './components/NavigationBarComponent'
import NotificationComponent from './components/NotificationComponent'
import Notification from './actions/NotificationAction'
import ResultComponent from './components/ResultComponent'
import foldQuery from './services/foldHaskellBasedQueryParser'
import PopUpComponent from './components/PopUpComponent'
import examples from './examples.json'
import DataSetComponent from './components/DataSetComponent'
import initialSchemaData from './exampleData/simpleSchema.json'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: "", showedNodeData: { data: [{ "key": undefined, "value": undefined }] },
			width: window.innerWidth, height: window.innerHeight, notification: "", showPopup: false,
			resultSet : {key: undefined, resultData: undefined, model: undefined},
			dataSet: { header: "Simple demo data", examples: examples, schemaData: initialSchemaData, schemaKey: "initialKey" }
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

	handleDataSetChange = (obj) => {
		let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now()
		this.setState({ dataSet: { header: obj.header, examples: obj.examples, schemaData: obj.schemaData, schemaKey: timeStampInMs } })
	}

	handleExampleQuery = (exampleQuery) => {
		this.setState({ query: exampleQuery })
	}

	initializeQueryResult = () => {
		this.setState({resultSet : {key: undefined, resultData: undefined, model: undefined}})
	}

	handleQuery = async (event) => {
		event.preventDefault()
		foldQuery.parseLetInQueryBlock(this.state.query)
		let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now()
		const answer = await foldQuery.executeQuery(this.state.query)
		switch (answer["model"]) {
			case "error":
				Notification.notify(answer["message"], "warning")
				break
			case "relational":
				if (answer["answer"] === undefined) {
					Notification.notify("Error in expressing the relational result.", "warning")
				} else {
					this.setState({resultSet : {key: timeStampInMs, resultData: answer["answer"], model: "relational"}})
				}
				break
			case "graph":
				if (answer["answer"] === undefined) {
					Notification.notify("Error in expressing the graph result.", "warning")
				} else {
					this.setState({resultSet : {key: timeStampInMs, resultData: answer["answer"], model: "graph"}})
				}
				break
			case "tree":
				if (answer["answer"] === undefined) {
					Notification.notify("Error in expressing the tree result.", "warning")
				} else {
					this.setState({resultSet : {key: timeStampInMs, resultData: answer["answer"], model: "tree"}})
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
					<FreeTextInputQueryComponent togglePopup={this.togglePopup.bind(this)} handleQueryChange={this.handleQueryChange} handleQuery={this.handleQuery} query={this.state.query} handleDataSetChange={this.handleDataSetChange} />
					<NotificationComponent />
					<Row>
						<DataSetComponent dataSet={this.state.dataSet} width={this.state.width} height={this.state.height} handleExampleQuery={this.handleExampleQuery} />
					</Row>
					<ResultComponent resultSet = {this.state.resultSet} width={this.state.width} height={this.state.height} query={this.state.query} 
						initializeResult = {this.initializeQueryResult.bind(this)} />
					<Row style={style.basicComponentsStyle}>
						<StatBox data={this.state.showedNodeData} />
					</Row>
					<NodeDataTextField />
				</Container>
				{this.state.showPopup ? <PopUpComponent closePopup={this.togglePopup.bind(this)} /> : null}
			</Container>
		)
	}
}

export default App