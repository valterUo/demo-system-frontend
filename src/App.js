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
import MainDataVisualizationComponent from './components/MainDataVisualizationComponent'
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
import QueryExecutingService from './services/QueryExecutingService'
import { parseJSONStringtoD3js } from './parsers/GraphDataParser'
import { parseJSONtoTree } from './parsers/TreeDataParser'
import { parseTablesFromData } from './parsers/RelationalDataParser'
import CategoricalViewService from './services/CategoricalViewToQueryService'
const __mainHTML = require('./infoTexts/mainHTML.js')
const __categoricalViewToQueryHTML = require('./infoTexts/categoricalViewToSchemaHTML.js')
const __examplesHTML = require('./infoTexts/examplesHTML.js')
const __resultHTML = require('./infoTexts/resultHTML.js')
const __schemaCategoryHTML = require('./infoTexts/schemaCategoryHTML.js')
const __uploadDataHTML = require('./infoTexts/uploadDataHTML.js')
const templateMain = { __html: __mainHTML }
const templateCategoricalViewToQuery = { __html: __categoricalViewToQueryHTML }
const templateExamples = { __html: __examplesHTML }
const templateResult = { __html: __resultHTML }
const templateSchemaCategory = { __html: __schemaCategoryHTML }
const templateUploadData = { __html: __uploadDataHTML }

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: "", showedStat: { data: [{ "header": undefined, "key": undefined, "value": undefined }] },
			width: window.innerWidth, height: window.innerHeight, showPopup: false, popContent: templateMain, fold: undefined,
			resultSet: { key: undefined, resultData: undefined, model: undefined },
			dataSet: {
				header: "Customer-Orders-Locations", examples: simpleExamples,
				schemaData: initialSchemaData, schemaKey: "initialKey", metaData: uploadInfo["simpleDemoData"]
			},
			showSchemaCategory: false, showCategoricalView: false, showResult: false, nameForCategoricalQueryView: "simpleDemo", queryId: undefined
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

	togglePopup(template) {
		switch (template) {
			case "main":
				this.setState({ showPopup: true, popContent: templateMain })
				break;
			case "categoricalViewToQuery":
				this.setState({ showPopup: true, popContent: templateCategoricalViewToQuery })
				break;
			case "examples":
				this.setState({ showPopup: true, popContent: templateExamples })
				break;
			case "result":
				this.setState({ showPopup: true, popContent: templateResult })
				break;
			case "schemaCategory":
				this.setState({ showPopup: true, popContent: templateSchemaCategory })
				break;
			case "uploadData":
				this.setState({ showPopup: true, popContent: templateUploadData })
				break;
			default:
				this.setState((prevState) => { return { showPopup: !prevState.showPopup } })
		}

	}

	toggleSchemaCategory(event) {
		event.preventDefault()
		this.setState((prevState) => { return { showSchemaCategory: !prevState.showSchemaCategory } })
	}

	toggleResult(event) {
		event.preventDefault()
		this.setState((prevState) => { return { showResult: !prevState.showResult, showCategoricalView: false } })
	}

	toggleCategoricalView = async (event) => {
		event.preventDefault()
		if(this.state.showCategoricalView) {
			this.setState({showCategoricalView: false})
		} else {
		if(this.state.queryId !== undefined) {
			let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now()
			const result = await CategoricalViewService.getCategoricalViewToQuery(this.state.queryId)
			console.log(result)
			this.setState((prevState) => { 
				return { showResult: false, showCategoricalView: true, resultSet: { key: timeStampInMs, resultData: result, model: "graph" }
			}})
		} else {
			Notification.notify("Execute query first!", "warning")
		}
	}
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

	executeQuery = async (event) => {
		event.preventDefault()
		let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now()
		const response = await QueryExecutingService.executeQuery(this.state.query)
		console.log(response)
		if (response !== undefined) {
			const id = response.data["id"]
			const result = await QueryExecutingService.getSelectiveQueryResultById(id)
			const model = result.data[0]["model"]
			let finalResult = null
			switch (model) {
				case "relational":
					let parsedResult = JSON.parse(JSON.parse(result.data[0]["result"].replace(/(\\[0-9])/g, "")))
					console.log(parsedResult["result"])
					finalResult = parseTablesFromData(parsedResult["result"])
					console.log(result)
					break
				case "algebraic graph":
				case "nimblegraph":
				case "rdf":
					finalResult = parseJSONStringtoD3js(result.data[0]["result"])
					console.log(result)
					break
				case "xml":
				case "json":
					parsedResult = JSON.parse(JSON.parse(result.data[0]["result"].replace(/(\\[0-9])/g, "")))
					finalResult = parseJSONtoTree(parsedResult["result"])
					console.log(result)
					break
				default:
					Notification.notify("Error in expressing the result. The result model is not defined.", "warning")
			}
			if (finalResult !== null) {
				this.setState({ fold: response.data["parsedQuery"], resultSet: { key: timeStampInMs, resultData: finalResult, model: model }, showResult: true, queryId: id })
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
						<DataSetSidePanel dataSet={this.state.dataSet} handleExampleQuery={this.handleExampleQuery} toggleSchemaCategory={this.toggleSchemaCategory.bind(this)} togglePopup={this.togglePopup.bind(this)} />
						<ResultNavigationSidePanel toggleResult={this.toggleResult.bind(this)} toggleCategoricalView={this.toggleCategoricalView.bind(this)} togglePopup={this.togglePopup.bind(this)} resultSet={this.state.resultSet} />
					</Col>
					<Col xl={9}>
						<Container fluid='true'>
							<FreeTextInputQueryComponent togglePopup={this.togglePopup.bind(this)} handleQueryChange={this.handleQueryChange} handleQuery={this.executeQuery} query={this.state.query} handleDataSetChange={this.handleDataSetChange} />
							<NotificationComponent />
							<SchemaComponent dataSet={this.state.dataSet} width={this.state.width} height={this.state.height} showSchemaCategory={this.state.showSchemaCategory} />
							<MainDataVisualizationComponent dataSet={this.state.dataSet} resultSet={this.state.resultSet} width={this.state.width} height={this.state.height} query={this.state.query}
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
				{this.state.showPopup ? <PopUpComponent closePopup={this.togglePopup.bind(this)} width={this.state.width} height={this.state.height} content={this.state.popContent} /> : null}
			</Container>
		)
	}
}

export default App