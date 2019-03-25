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
import data1 from './exampleData/data1.json'
import data2 from './exampleData/data2.json'
import data3 from './exampleData/data3.json'
import schema from './exampleData/schema.json'
import StatBox from './StatBox'
import store from './store'
import Tree from './dataComponents/treeComponents/Tree'
import MultiGraph from './dataComponents/multiGraphComponents/MultiGraph'
import DemoDataParser from './oldDemoDataHandling/oldDemoDataParser'

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
		this.state = { query: "", showedNodeData: {data: [{ "key": undefined, "value": undefined }]}, sqlData: undefined, documentData: undefined, graphData: undefined, isHidden: true }
	}

	componentDidMount() {
		DemoDataParser.loadData("document", store)
	}

	handleQuery = (event) => {
		event.preventDefault()
		console.log('nappia painettu')
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
		const currentObject = this.state.showedNodeData
		const newObject = store.getState().nodeData
		if (JSON.stringify(currentObject) !== JSON.stringify(newObject)) {
			this.setState({
				showedNodeData: store.getState().nodeData
			})
		}

		const oldSqlData = this.state.sqlData
		const newSqlData = store.getState().queriedDemoData.sqlData

		if (JSON.stringify(oldSqlData) !== JSON.stringify(newSqlData)) {
			console.log('sqlData')
			this.setState({
				sqlData: store.getState().queriedDemoData.sqlData
			})
		}
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
								{this.state.sqlData !== undefined &&
									<Tabs defaultActiveKey="rel" id="uncontrolled-tab-example">
										<Tab eventKey="rel" title="Relational output">
											<RelationalTabs tables={this.state.sqlData} />
										</Tab>
										<Tab eventKey="tree" title="XML output">
											<Tree id="3" data={data1} width={500} height={500} nodeName={"secondNodes"} linkName={"secondLinks"} nameClass={"secondGraph"} />
										</Tab>
										<Tab eventKey="graph" title="Graph output">
											<Graph id="4" data={data2} width={500} height={500} nodeName={"firstNodes"} linkName={"firstLinks"} nameClass={"firstGraph"} />
										</Tab>
									</Tabs>
								}

							</Row>
							<Row style={lightBorderRight}>
								<StatBox data={this.state.showedNodeData} />
							</Row>
						</Col>
					</Row>
				</Container>
			</Container>
		)
	}
}

export default App