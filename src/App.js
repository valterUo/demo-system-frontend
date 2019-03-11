import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Navbar } from 'react-bootstrap'
import githubimage from './GitHub-Mark-64px.png'
import RelationalComponent from './dataComponents/relationalComponent'
import Graph from './dataComponents/graphComponents/Graph'

class App extends Component {

	render() {
		return (
			<Container fluid='true'>
				<Navbar bg="light" expand="lg">
					<Navbar.Brand href="#home">Category Theory in Multi-model Databases</Navbar.Brand>
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
						<Form>
  							<Form.Group controlId="formBasicEmail">
    						<Form.Label>Query Input</Form.Label>
    						<Form.Control type="text" placeholder="Enter query or choose defined query" />
  							</Form.Group>
  						<Button variant="dark" type="submit">
    						Execute
  						</Button>
						</Form>
 					</Col>
						<Col>
							<Row>
		Schema
														  
	    </Row>
							<Row>
							Another Schema
	    </Row>
						</Col>
						<Col>Output result
	        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
								<Tab eventKey="rel" title="Relational output">
									<RelationalComponent data={[['first', 'second'], ['1', '2']]} />
								</Tab>
								<Tab eventKey="tree" title="XML output">
									Document Data
	    </Tab>
								<Tab eventKey="graph" title="Graph output">
								<Graph data = {{"nodes": [{"name": "wqerty", "id": 0}, {"name": "fdsa", "id": 1}, {"name": "werweqerty", "id": 2}, {"name": "gfgf", "id": 3}], 
								"links": [{"source": 3,"target":1 }, {"source": 2,"target": 0}, {"source": 2,"target": 1}, {"source": 0,"target": 3}]}} width = {300} height = {300} />
	    </Tab>
							</Tabs>
						</Col>
					</Row>
				</Container>
			</Container>
	);
    }
}

export default App;
