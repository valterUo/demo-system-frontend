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
import DemoDataParser from './oldDemoDataHandling/oldDemoDataParser'
import FileSubmitComponent from './components/FileSubmitComponent'
import NavigationBarComponent from './components/NavigationBarComponent'
import SchemaComponent from './components/SchemaComponent'
import style from './styles'
import ResultComponent from './components/ResultComponent'
import MLQueryComponent from './components/MLQueryComponent'
import ml from './services/metaLanguageCompilerService'
import NotificationComponent from './components/NotificationComponent'
import NewQueryComponent from './components/NewQueryComponent'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: "", showedNodeData: { data: [{ "key": undefined, "value": undefined }] }, schemaData: data3, schemaKey: "",
			sqlData: undefined, documentData: undefined, graphData: undefined, nodeName: undefined, linkName: undefined,
			nameClass: undefined, treeKey: undefined, relationalKey: undefined, graphKey: undefined, queryAnswers: [], activeDropdown: false, sourceFunction: undefined, targetFunction: undefined,
			queryMode: "", width: window.innerWidth, height: window.innerHeight, mlSchemaData: {}, notification: "", currentConstant: ""
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
		let data = undefined
		switch (this.state.query) {
			case "Select FirstName, LastName from Person where id = \"933\"":
				data = await DemoDataParser.loadData("sql")
				this.setState({
					nodeName: "sqlNodes",
					linkName: "sqlLinks",
					nameClass: "sqlElement",
					sqlData: data.sqlData,
					documentData: data.documentData,
					graphData: data.graphData,
					treeKey: 10,
					relationalKey: 20,
					graphKey: 40
				})
				break
			case ".//invoice[personId=\"10995116278711\"]/orderline":
				data = await DemoDataParser.loadData("document")
				this.setState({
					nodeName: "documentNodes",
					linkName: "documentLinks",
					nameClass: "documentElement",
					sqlData: data.sqlData,
					documentData: data.documentData,
					graphData: data.graphData,
					treeKey: 50,
					relationalKey: 60,
					graphKey: 70
				})
				break
			case "MATCH (a:Person {name: 'Jennifer'})-[r:WORK_FOR]->(b:University)":
				data = await DemoDataParser.loadData("graph")
				this.setState({
					nodeName: "graphNodes",
					linkName: "graphLinks",
					nameClass: "graphElement",
					sqlData: data.sqlData,
					documentData: data.documentData,
					graphData: data.graphData,
					treeKey: 80,
					relationalKey: 90,
					graphKey: 100
				})
				break
			default:
				const answer = await ml.compile(this.state.query)
				this.setState(state => {
					const newAnswer = answer.data.replace('\n-', '').trim()
					const newAnswers = [...state.queryAnswers, newAnswer]
					return { queryAnswers: newAnswers }
				})
				break
		}
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

	selectQuery = (id) => {
		// eslint-disable-next-line default-case
		switch (id) {
			case 1:
				this.setState({ query: "Select FirstName, LastName from Person where id = \"933\"" })
				break
			case 2:
				this.setState({ query: ".//invoice[personId=\"10995116278711\"]/orderline" })
				break
			case 3:
				this.setState({ query: "MATCH (a:Person {name: 'Jennifer'})-[r:WORK_FOR]->(b:University)" })
				break
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
	}

	toggleDropdown() {
		this.setState({ activeDropdown: true, queryMode: "Defined queries", acceptFunctions: false })
	}

	handleFunctionDefinition() {
		this.setState({ activeDropdown: false, queryMode: "Source and target function", acceptFunctions: true })
	}

	handleMLcompiler() {
		this.setState({ activeDropdown: false, queryMode: "ML code compiler", acceptFunctions: false })
	}

	render() {
		store.subscribe(this.handleStoreChange)

		return (
			<Container style={{ backgroundColor: "#f1f1f2", minHeight: this.state.height }} fluid='true'>
				<NavigationBarComponent />
				<Container fluid='true'>
					<Row style={style.basicComponentsStyle}>
						<Col xl = {1}>
							<h4 align="right">Input</h4>
						</Col>
						<Col xl = {2}>
							<Dropdown style={{ marginTop: "4px" }}>
								<Dropdown.Toggle variant="light" id="dropdown-query-mode">
									{this.state.queryMode === "" ? "Query mode" : this.state.queryMode}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item action="true" variant="primary" onClick={() => this.toggleDropdown()}>Defined queries</Dropdown.Item>
									<Dropdown.Item action="true" variant="primary" onClick={() => this.handleFunctionDefinition()}>Source and target</Dropdown.Item>
									<Dropdown.Item action="true" variant="primary" onClick={() => this.handleMLcompiler()}>ML code compiler</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</Col>
						<Col xl={5} style={{ align: "left" }}>
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
						<Col xl = {2}>
							{this.state.activeDropdown && <Dropdown style={{ marginTop: "4px" }}>
								<Dropdown.Toggle variant="dark" id="dropdown-predefined-queries">
									Defined queries
  							</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item action="true" variant="primary" onClick={() => this.selectQuery(1)}><code><pre>Select FirstName, LastName from Person where id = "933"</pre></code></Dropdown.Item>
									<Dropdown.Item action="true" variant="primary" onClick={() => this.selectQuery(2)}><code><pre>.//invoice[personId="10995116278711"]/orderline</pre></code></Dropdown.Item>
									<Dropdown.Item action="true" variant="primary" onClick={() => this.selectQuery(3)}><code><pre>MATCH (a:Person name: 'Jennifer')-[r:WORK_FOR]->(b:University)</pre> <pre>RETURN a, r, b</pre></code></Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>}
						</Col>
						<Col xl = {2}>
							<FileSubmitComponent />
						</Col>
						<Col>
						<NotificationComponent/>
						</Col>
					</Row>
						<Row style={style.basicComponentsStyle}>
						<NewQueryComponent/>
						</Row>
					<Row>
						<Col xl={6}>
							<SchemaComponent width={this.state.width} height={this.state.height} schemaKey={this.state.schemaKey} schemaData={this.state.schemaData}
								schemaVisible={this.state.schemaVisible} mlSchemaData={this.state.mlSchemaData} />
						</Col>
						<Col xl={6}>
							<MLQueryComponent answers={this.state.queryAnswers} />
							<ResultComponent width={this.state.width} height={this.state.height} sqlData={this.state.sqlData} relationalKey={this.state.relationalKey} documentData={this.state.documentData} treeKey={this.state.treeKey}
								graphData={this.state.graphData} graphKey={this.state.graphKey} nodeName={this.state.nodeName} linkName={this.state.linkName} nameClass={this.state.className} />
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