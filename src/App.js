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
import RelationalComponent from './dataComponents/relationalComponent'
import Graph from './dataComponents/graphComponents/Graph'
import data1 from './exampleData/data1.json'
import data2 from './exampleData/data2.json'
import data3 from './exampleData/data3.json'

const lightBorder = {
	borderStyle: "solid",
	borderLeftWidth: "1px",
	borderRightWidth: "1px",
	borderTopWidth: "0px",
	borderBottomWidth: "1px",
	borderColor: "#d9d9d9"
}

class App extends Component {
	constructor(props) {
		super(props)
		this.state = { query: "" }
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
		switch(id) {
		case 1:
		this.setState({query: "Select FirstName, LastName from Person where id = \"933\""})
		break
		case 2:
		this.setState({query: ".//invoice[personId=\"10995116278711\"]/orderline"})
		break
		case 3:
		this.setState({query: "MATCH (a:Person {name: 'Jennifer'})-[r:WORK_FOR]->(b:University)"})
		break
		}
	}

	render() {
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
								<ListGroup.Item action variant="primary" onClick = {() => this.selectQuery(1)}><code><pre>Select FirstName, LastName from Person where id = "933"</pre></code></ListGroup.Item>
								<ListGroup.Item action variant="primary" onClick = {() => this.selectQuery(2)}><code><pre>.//invoice[personId="10995116278711"]/orderline</pre></code></ListGroup.Item>
								<ListGroup.Item action variant="primary" onClick = {() => this.selectQuery(3)}><code><pre>MATCH (a:Person name: 'Jennifer')-[r:WORK_FOR]->(b:University)</pre> <pre>RETURN a, r, b</pre></code></ListGroup.Item>
							</ListGroup>
						</Col>
						<Col>
							<Row style = {lightBorder}>
							<h4>Schema</h4>
								<Graph id="1" data={data3} width={500} height={500} nodeName={"schemaNodes"} linkName={"schemaLinks"} nameClass={"schemaGraph"} />

							</Row>
							<Row style = {lightBorder}>
							<h4>Query schema</h4>
								<Graph id="2" data={data2} width={500} height={500} nodeName={"queryNodes"} linkName={"queryLinks"} nameClass={"queryGraph"} />
							</Row>
						</Col>
						<Col><h4>Result</h4>
	        				<Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
								<Tab eventKey="rel" title="Relational output">
									<RelationalComponent data={[['first', 'second'], ['1', '2']]} />
								</Tab>
								<Tab eventKey="tree" title="XML output">
								<Graph id="3" data={data1} width={500} height={500} tree={true} nodeName={"secondNodes"} linkName={"secondLinks"} nameClass={"secondGraph"} />
								</Tab>
								<Tab eventKey="graph" title="Graph output">
									<Graph id="4" data={data2} width={500} height={500} nodeName={"firstNodes"} linkName={"firstLinks"} nameClass={"firstGraph"} />
								</Tab>
							</Tabs>
						</Col>
					</Row>
				</Container>
			</Container>
		)
	}
}

export default App;