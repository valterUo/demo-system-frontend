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
import MLarrowToGraph from './metaLanguageComponents/MLarrowToGraph'
import style from './styles'
import ResultComponent from './components/ResultComponent'
import ml from './services/metaLanguageCompilerService'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: "", showedNodeData: { data: [{ "key": undefined, "value": undefined }] }, schemaData: data3, schemaKey: "",
			sqlData: undefined, documentData: undefined, graphData: undefined, nodeName: undefined, linkName: undefined,
			nameClass: undefined, treeKey: undefined, relationalKey: undefined, graphKey: undefined
		}
	}

	async componentDidMount() {
		//"OS.Process.exit(OS.Process.success); \n"
		store.dispatch({type: 'ADD_SCHEMA_DATA', data: data3, key: ""})
		await ml.compile("datatype ('oA,'aA, 'oB,'aB) Functor = ffunctor of ('oA, 'aA) Cat * ('oA -> 'oB) * ('aA -> 'aB) * ('oB,'aB) Cat;")
		//await ml.compile("datatype ('oA,'aA, 'oB,'aB) Functor = ffunctor of ('oA, 'aA) Cat * ('oA -> 'oB) * ('aA -> 'aB) * ('oB,'aB) Cat;\n")
		await ml.compile("1 + 2 + 3;")
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
				break
		}
		this.setState({ query: "" })
	}

	handleQueryChange = (event) => {
		console.log(event.target.value)
		this.setState({ query: event.target.value })
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

	render() {
		store.subscribe(this.handleStoreChange)

		return (
			<Container style={style.backgroundColorStyle} fluid='true'>
				<NavigationBarComponent />
				<Container fluid='true'>
					<Row style={style.basicComponentsStyle}>
						<Col xl={1}>
							<h4 align="right">Query Input</h4>
						</Col>
						<Col xl={6} style={{ align: "left" }}>
							<Form onSubmit={this.handleQuery} inline>
								<Form.Control type="text" placeholder="Enter query or choose defined query" value={this.state.query} onChange={this.handleQueryChange} style={{ width: "80%", marginRight: "5px" }} />
								<Button type="submit" variant="dark"> <i className='fas fa-play' style={{ fontSize: '24px', marginTop: "4px" }}></i> </Button>
							</Form>
						</Col>
						<Col xl={3}>
							<Dropdown style={{ marginTop: "4px" }}>
								<Dropdown.Toggle variant="dark" id="dropdown-predefined-queries">
									Defined queries
  							</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item action="true" variant="primary" onClick={() => this.selectQuery(1)}><code><pre>Select FirstName, LastName from Person where id = "933"</pre></code></Dropdown.Item>
									<Dropdown.Item action="true" variant="primary" onClick={() => this.selectQuery(2)}><code><pre>.//invoice[personId="10995116278711"]/orderline</pre></code></Dropdown.Item>
									<Dropdown.Item action="true" variant="primary" onClick={() => this.selectQuery(3)}><code><pre>MATCH (a:Person name: 'Jennifer')-[r:WORK_FOR]->(b:University)</pre> <pre>RETURN a, r, b</pre></code></Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</Col>
						<Col xl={2}>
							<FileSubmitComponent />
						</Col>
					</Row>
					<Row>
						<Col xl={6}>
							<SchemaComponent schemaKey={this.state.schemaKey} schemaData={this.state.schemaData} />
						</Col>
						<Col xl={6}>
							<ResultComponent sqlData={this.state.sqlData} relationalKey={this.state.relationalKey} documentData={this.state.documentData} treeKey={this.state.treeKey}
								graphData={this.state.graphData} graphKey={this.state.graphKey} nodeName={this.state.nodeName} linkName={this.state.linkName} nameClass={this.state.className} />
							<Row style={style.basicComponentsStyle}>
								<StatBox data={this.state.showedNodeData} />
							</Row>
							<Row style={style.basicComponentsStyle}>
								<Col>
									<NodeDataTextField />
								</Col>
							</Row>
						</Col>
					</Row>
					<MLarrowToGraph />
				</Container>
				<footer>
				<hr style= {{ color: "black", borderWidth:"1px", display: "block", borderStyle: "inset" }}></hr>
					<p>Category Theory in Multi-model Databases</p>
				</footer>
			</Container>
		)
	}
}

export default App