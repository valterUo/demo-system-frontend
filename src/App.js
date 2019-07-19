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
import smlCompiler from './services/metaLanguageCompilerService'
import haskellCompiler from './services/haskellCompilerService'
import NotificationComponent from './components/NotificationComponent'
import Notification from './actions/NotificationAction'
import QueryAnswerParser from './services/queryAnswerParser'
import ResultComponent from './components/ResultComponent'
import Dropdown from 'react-bootstrap/Dropdown'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: "", showedNodeData: { data: [{ "key": undefined, "value": undefined }] }, schemaData: data3, schemaKey: "", nodeName: undefined, linkName: undefined,
			nameClass: undefined, queryAnswers: [], sourceFunction: undefined, targetFunction: undefined,
			queryMode: "", width: window.innerWidth, height: window.innerHeight, mlSchemaData: {}, notification: "", currentConstant: "", queryResultKey: "", queryResultModel: "",
			coreLanguage: "Haskell", relationalResult: undefined, relationalKey: "initialRelationalKey", graphResult: undefined, graphKey: "initialGraphKey"
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
		if (this.state.coreLanguage === "SML") {
			console.log(this.state.query)
			const answer = await smlCompiler.compile(this.state.query)
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
		} else if (this.state.coreLanguage === "Haskell") {
			if (this.state.queryResultModel === "table") {
				let answer = await haskellCompiler.compileRelationalQuery(this.state.query)
				console.log(answer)
				answer = haskellCompiler.parseJSONList(answer)
				if (answer.length === 0) {
					Notification.notify("Result is empty.", "warning")
					this.setState({ relationalResult: undefined, relationalKey: "initialRelationalKey" })
				}
				else {
					const relationalTables = haskellCompiler.JSONtoRelationalTables(answer)
					this.setState({
						relationalResult: relationalTables,
						relationalKey: JSON.stringify(answer[0]) + answer.length,
						graphData: undefined,
						graphKey: "initialGraphKey"
					})
				}
			} else if (this.state.queryResultModel === "graph") {
				let graphData = await haskellCompiler.compileGraphQuery(this.state.query)
				console.log(graphData)
				if (graphData !== undefined) {
					if (graphData["links"].length === 0 && graphData["nodes"].length === 0) {
						Notification.notify("Result is empty.", "warning")
						this.setState({ graphResult: undefined, graphKey: "initialGraphKey" })
					} else {
						console.log(graphData)
						this.setState({
							graphResult: graphData,
							graphKey: JSON.stringify(graphData["nodes"][0]) + graphData["nodes"].length,
							relationalResult: undefined,
							relationalKey: "initialRelationalKey"
						})
					}
				} else {
					Notification.notify("The result cannot be expressed as a graph.", "warning")
				}
			}
		}
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

	handleExampleQuery = (exampleQuery) => {
		this.setState({ query: exampleQuery })
	}

	render() {
		store.subscribe(this.handleStoreChange)

		return (
			<Container style={{ backgroundColor: "#f1f1f2", minHeight: this.state.height }} fluid='true'>
				<NavigationBarComponent />
				<Container fluid='true'>
					<FreeTextInputQueryComponent handleQueryChange={this.handleQueryChange} handleQuery={this.handleQuery} query={this.state.query} handleDataModelChange={this.handleDataModelChange} handleCoreLanguage={this.handleCoreLanguageChange} />
					<NotificationComponent />
					<Row style={style.basicComponentsStyle}>
						<div style={style.queryButtonStyle}>
							<Dropdown>
								<Dropdown.Toggle variant="dark" id="dropdown-basic">
									Select example query
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item eventKey="1" onClick={() => this.handleExampleQuery("evaluatePredicate customers (\\y -> customerId y == 6) $$ ((\\x y -> knows y x), customers) ^=^ (\\x -> creditLimit x > 1000)")}>evaluatePredicate customers (\y -> customerId y == 6) $$ ((\x y -> knows y x), customers) ^=^ (\x -> creditLimit x > 1000)</Dropdown.Item>
									<Dropdown.Item eventKey="2" onClick={() => this.handleExampleQuery("evaluatePredicate orders (\\y -> orderNumber y == \"3qqqeq9\") $$ ((\\y x -> contains y x), products) ^=^ (\\x -> productPrice x > 50)")}>evaluatePredicate orders (\y -> orderNumber y == "3qqqeq9") $$ ((\y x -> contains y x), products) ^=^ (\x -> productPrice x > 50)</Dropdown.Item>
									<Dropdown.Item eventKey="3" onClick={() => this.handleExampleQuery("evaluatePredicate orders (\\x -> elem \"Carpet\" (map productName (orderProducts x))) $$ ((\\x y -> ordered x customers == y), customers)")}>evaluatePredicate orders (\x -> elem "Carpet" (map productName (orderProducts x))) $$ ((\x y -> ordered x customers == y), customers)</Dropdown.Item>
									<Dropdown.Item eventKey="1" onClick={() => this.handleExampleQuery("evaluatePredicate customers (\\y -> customerName y == \"Alice\") $$ ((\\x y -> knows x y), customers)")}>evaluatePredicate customers (\y -> customerName y == "Alice") $$ ((\x y -> knows x y), customers)</Dropdown.Item>
									<Dropdown.Item eventKey="2" onClick={() => this.handleExampleQuery("evaluatePredicate customers (\\y -> customerName y == \"Alice\") $$ ((\\x y -> knows x y), customers) $$ ((\\x y -> knows x y), customers) $$ ((\\x y -> ordered y customers == x), orders) ^=^ (\\x -> (sum $ map productPrice (orderProducts x)) > 5000)")}>evaluatePredicate customers (\y -> customerName y == "Alice") $$ ((\x y -> knows x y), customers) $$ ((\x y -> knows x y), customers) $$ ((\x y -> ordered y customers == x), orders) ^=^ (\x -> (sum $ map productPrice (orderProducts x)) > 5000)</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					</Row>
					{/*<Row style={style.basicComponentsStyle}>
						<DataUploadComponent />
					</Row>
					<Row style={style.basicComponentsStyle}>
						<NewQueryComponent handleCoreLanguage={this.handleCoreLanguageChange} handleDataModelChange={this.handleDataModelChange} />
					</Row>*/}
					<Row>
						<Col xl={6}>
							<SchemaComponent width={this.state.width} height={this.state.height} schemaKey={this.state.schemaKey} schemaData={this.state.schemaData}
								schemaVisible={this.state.schemaVisible} mlSchemaData={this.state.mlSchemaData} />
						</Col>
						<Col xl={6}>
							<MLQueryComponent answers={this.state.queryAnswers} />
							<ResultComponent queryResultModel={this.state.queryResultModel} relationalKey={this.state.relationalKey}
								relationalResult={this.state.relationalResult} graphKey={this.state.graphKey} graphResult={this.state.graphResult}
								width={this.state.width} height={this.state.height} />
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