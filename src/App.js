import React, { Component } from 'react'
import './App.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { Navbar } from 'react-bootstrap'
import githubimage from './GitHub-Mark-64px.png'
import RelationalTabs from './dataComponents/relationalComponents/relationalTabs'
import Graph from './dataComponents/graphComponents/Graph'
import data3 from './exampleData/data3.json'
import schema from './exampleData/schema.json'
import StatBox from './StatBox'
import store from './store'
import Tree from './dataComponents/treeComponents/Tree'
import MultiGraph from './dataComponents/multiGraphComponents/MultiGraph'
import DemoDataParser from './oldDemoDataHandling/oldDemoDataParser'
import FileSender from './services/sendFiles'
import MLarrowToGraph from './metaLanguageComponents/MLarrowToGraph'
//import data1 from './exampleData/data1.json'
//import data2 from './exampleData/data2.json'

const lightBorderLeft = {
	borderStyle: "solid",
	borderLeftWidth: "1px",
	borderRightWidth: "1px",
	borderTopWidth: "0px",
	borderBottomWidth: "1px",
	borderColor: "#d9d9d9"
}

const lightBorderRight = {
	borderStyle: "solid",
	borderLeftWidth: "0px",
	borderRightWidth: "1px",
	borderTopWidth: "0px",
	borderBottomWidth: "1px",
	borderColor: "#d9d9d9"
}

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: "", showedNodeData: { data: [{ "key": undefined, "value": undefined }] },
			sqlData: undefined, documentData: undefined, graphData: undefined, nodeName: undefined, linkName: undefined,
			nameClass: undefined, treeKey: undefined, relationalKey: undefined, graphKey: undefined
		}
		this.file = React.createRef()
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

	handleFileSubmit = async (event) => {
		event.preventDefault()
		console.log('file submitted')
		console.log(this.file.current.files[0].name)
		const answer = await FileSender.sendFiles(this.file.current.files[0], this.file.current.files[0].name)
		console.log(answer)
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
		this.setState({
			showedNodeData: store.getState().nodeData
		})
	}

	render() {

		store.subscribe(this.handleStoreChange)

		return (
			<Container fluid='true'>
				<Navbar bg="light" expand="lg">
					<Navbar.Brand href="#home"><h3>Category Theory in Multi-model Databases</h3></Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse className="justify-content-end">
						<a href="https://www.helsinki.fi/en/researchgroups/unified-database-management-systems-udbms">
							UDBMS
	    </a>
						<div>&nbsp; &nbsp;</div>
						<a href="https://github.com/enorvio/demo-system">
							<img width="30" height="30" src={githubimage} alt="githublogo" />
						</a>
					</Navbar.Collapse>
				</Navbar>

				<Container fluid='true'>
					<Row>
						<Col>
							<Form onSubmit={this.handleQuery}>
								<Form.Group controlId="queryForm">
									<Form.Label><h4>Query Input</h4></Form.Label>
									<Form.Control type="text" placeholder="Enter query or choose defined query" value={this.state.query} onChange={this.handleQueryChange} />
								</Form.Group>
								<Button type="submit" variant="dark">
									Execute
  						</Button>
							</Form>
							<div>&nbsp; &nbsp;</div>
							<h5>Defined queries</h5>
							<ListGroup>
								<ListGroup.Item action variant="primary" onClick={() => this.selectQuery(1)}><code><pre>Select FirstName, LastName from Person where id = "933"</pre></code></ListGroup.Item>
								<ListGroup.Item action variant="primary" onClick={() => this.selectQuery(2)}><code><pre>.//invoice[personId="10995116278711"]/orderline</pre></code></ListGroup.Item>
								<ListGroup.Item action variant="primary" onClick={() => this.selectQuery(3)}><code><pre>MATCH (a:Person name: 'Jennifer')-[r:WORK_FOR]->(b:University)</pre> <pre>RETURN a, r, b</pre></code></ListGroup.Item>
							</ListGroup>
							<div>&nbsp; &nbsp;</div>
							<Form onSubmit={this.handleFileSubmit}>
							<Form.Group>
								<Form.Label>
								<h4>Upload files</h4>
									</Form.Label>
									<Form.Control as='input' type="file" multiple="multiple" ref={this.file} />
									</Form.Group>
								<Button type="submit" value="Submit" variant="dark">Submit</Button>
							</Form>

						</Col>
						<Col>
							<Row style={lightBorderLeft}>
								<h4>Schema</h4>
								<Graph id="1" data={data3} width={500} height={500} nodeName={"schemaNodes"} linkName={"schemaLinks"} nameClass={"schemaGraph"} />

							</Row>
							<Row style={lightBorderLeft}>
								<h4>Query schema</h4>
								<MultiGraph id="2" data={schema} width={500} height={500} nodeName={"queryNodes"} linkName={"queryLinks"} nameClass={"queryGraph"} />
							</Row>
						</Col>
						<Col><h4>Result</h4>
							<Row style={lightBorderRight}>
								{(this.state.sqlData !== undefined && this.state.documentData !== undefined && this.state.graphData !== undefined) &&
									<Tabs defaultActiveKey="rel" id="uncontrolled-tab-example">
										<Tab eventKey="rel" title="Relational output">
											<RelationalTabs key={this.state.relationalKey} tables={this.state.sqlData} />
										</Tab>
										<Tab eventKey="tree" title="XML output">
											<Tree key={this.state.treeKey} id="3" data={this.state.documentData} width={500} height={500} nodeName={this.state.nodeName + 'First'} linkName={this.state.linkName + 'First'} nameClass={this.state.nameClass + 'First'} />
										</Tab>
										<Tab eventKey="graph" title="Graph output">
											<Graph key={this.state.graphKey} id="4" data={this.state.graphData} width={500} height={500} nodeName={this.state.nodeName + 'Second'} linkName={this.state.linkName + 'Second'} nameClass={this.state.nameClass + 'Second'} />
										</Tab>
									</Tabs>
								}
							</Row>
							<Row style={lightBorderRight}>
								<StatBox data={this.state.showedNodeData} />
							</Row>
						</Col>
					</Row>
					<MLarrowToGraph/>
				</Container>
			</Container>
		)
	}
}

export default App