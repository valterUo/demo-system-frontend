import React, { Component } from 'react'
import './App.css'
import style from './styles'
import store from './store'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import StatBox from './components/StatBox'
import FreeTextInputQueryComponent from './components/queryComponents/FreeTextInputQueryComponent'
import NavigationBarComponent from './components/NavigationBarComponent'
import NotificationComponent from './components/NotificationComponent'
import Notification from './actions/NotificationAction'
import ResultComponent from './components/ResultComponent'
import foldQuery from './services/foldHaskellBasedQueryParser'
import PopUpComponent from './components/PopUpComponent'
import simpleExamples from './queryExamples/simpleDemoDataExamples.json'
import SchemaComponent from './components/SchemaComponent'
import initialSchemaData from './schemasForD3/simpleSchema.json'
import Col from 'react-bootstrap/Col'
import ResultNavigationSidePanel from './components/ResultNavigationSidePanel'
import DataSetSidePanel from './components/DataSetSidePanel'
import uploadInfo from './dataUploadInfo/uploadInfo.json'
import FoldViewBox from './components/FoldViewBox'
import ErrorBoundary from './errorBoundary/ErrorBoundary'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: "", showedStat: { data: [{ "header": undefined, "key": undefined, "value": undefined }] },
			width: window.innerWidth, height: window.innerHeight, notification: "", showPopup: false, fold: undefined,
			resultSet: { key: undefined, resultData: undefined, model: undefined },
			dataSet: {
				header: "Customer-Orders-Locations Dataset", examples: simpleExamples,
				schemaData: initialSchemaData, schemaKey: "initialKey", metaData: uploadInfo["simpleDemoData"]
			},
			showSchemaCategory: false, showCategoricalView: false, showResult: false, nameForCategoricalQueryView: "simpleDemo"
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

	toggleSchemaCategory(event) {
		event.preventDefault()
		this.setState((prevState) => { return { showSchemaCategory: !prevState.showSchemaCategory, showResult: false, showCategoricalView: false } })
	}

	toggleResult(event) {
		event.preventDefault()
		this.setState({ showSchemaCategory: false, showResult: true, showCategoricalView: false })
	}

	toggleCategoricalView(event) {
		event.preventDefault()
		this.setState({ showSchemaCategory: false, showResult: false, showCategoricalView: true })
	}

	handleStoreChange = () => {
		if (this.state.showedStat !== store.getState().nodeData) {
			this.setState({
				showedStat: store.getState().nodeData
			})
		}
	}

	handleDataSetChange = (obj) => {
		let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now()
		this.setState({ dataSet: { header: obj.header, examples: obj.examples, schemaData: obj.schemaData, schemaKey: timeStampInMs, metaData: obj.metaData, nameForCategoricalQueryView: obj.nameForCategoricalQueryView } })
	}

	handleExampleQuery = (exampleQuery) => {
		this.setState({ query: exampleQuery })
	}

	initializeQueryResult = () => {
		this.setState({ resultSet: { key: undefined, resultData: undefined, model: undefined } })
	}

	handleQuery = async (event) => {
		event.preventDefault()
		//foldQuery.parseLetInQueryBlock(this.state.query)
		let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now()
		const queryAndModel = foldQuery.getTheQuery(this.state.query)
		if (queryAndModel["model"] === "error") {
			Notification.notify(queryAndModel["message"], "warning")
		} else {
			this.setState({ fold: queryAndModel["query"] })
			const answer = await foldQuery.executeQuery(queryAndModel.model, queryAndModel.query)
			switch (answer["model"]) {
				case "error":
					Notification.notify(answer["message"], "warning")
					break
				case "relational":
					if (answer["answer"] === undefined) {
						Notification.notify("Error in expressing the relational result.", "warning")
					} else {
						this.setState({ resultSet: { key: timeStampInMs, resultData: answer["answer"], model: "relational" }, showResult: true })
					}
					break
				case "graph":
					if (answer["answer"] === undefined) {
						Notification.notify("Error in expressing the graph result.", "warning")
					} else {
						this.setState({ resultSet: { key: timeStampInMs, resultData: answer["answer"], model: "graph" }, showResult: true })
					}
					break
				case "xml":
					if (answer["answer"] === undefined) {
						Notification.notify("Error in expressing the XML result.", "warning")
					} else {
						this.setState({ resultSet: { key: timeStampInMs, resultData: answer["answer"], model: "xml" }, showResult: true })
					}
					break
				case "json":
					if (answer["answer"] === undefined) {
						Notification.notify("Error in expressing the json result.", "warning")
					} else {
						this.setState({ resultSet: { key: timeStampInMs, resultData: answer["answer"], model: "json" }, showResult: true })
					}
					break
				case "rdf":
					if (answer["answer"] === undefined) {
						Notification.notify("Error in expressing the rdf result.", "warning")
					} else {
						this.setState({ resultSet: { key: timeStampInMs, resultData: answer["answer"], model: "rdf" }, showResult: true })
					}
					break
				default:
					Notification.notify("Unknown error! An answer to the query did not follow any model.", "warning")
					break
			}
		}
	}

	render() {
		store.subscribe(this.handleStoreChange)

		return (
			<Container style={{ backgroundColor: "#f1f1f2", minHeight: this.state.height }} fluid='true'>
				<NavigationBarComponent />
				<Row>
					<Col xl={3} style={style.navPanelStyle} >
						<DataSetSidePanel dataSet={this.state.dataSet} handleExampleQuery={this.handleExampleQuery} toggleSchemaCategory={this.toggleSchemaCategory.bind(this)} />
						<ResultNavigationSidePanel toggleResult={this.toggleResult.bind(this)} toggleCategoricalView={this.toggleCategoricalView.bind(this)} />
					</Col>
					<Col xl={9}>
						<Container fluid='true'>
							<FreeTextInputQueryComponent togglePopup={this.togglePopup.bind(this)} handleQueryChange={this.handleQueryChange} handleQuery={this.handleQuery} query={this.state.query} handleDataSetChange={this.handleDataSetChange} />
							<NotificationComponent />
							<SchemaComponent dataSet={this.state.dataSet} width={this.state.width} height={this.state.height} showSchemaCategory={this.state.showSchemaCategory} />
							<ResultComponent dataSet={this.state.dataSet} resultSet={this.state.resultSet} width={this.state.width} height={this.state.height} query={this.state.query}
								initializeResult={this.initializeQueryResult.bind(this)} showCategoricalView={this.state.showCategoricalView} showResult={this.state.showResult} />
							<Row>
								<Col>
									<ErrorBoundary>
										<StatBox data={this.state.showedStat} />
									</ErrorBoundary>
								</Col>
								<Col>
									<FoldViewBox fold={this.state.fold} />
								</Col>
							</Row>
						</Container>
					</Col>
				</Row>
				{this.state.showPopup ? <PopUpComponent closePopup={this.togglePopup.bind(this)} /> : null}
			</Container>
		)
	}
}

export default App