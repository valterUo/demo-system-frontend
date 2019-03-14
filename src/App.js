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
import data1 from './exampleData/data1.json'
import data2 from './exampleData/data2.json'
import data3 from './exampleData/data3.json'

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
  						<Button variant="dark">
    						Execute
  						</Button>
						</Form>
 					</Col>
						<Col>
							<Row>
							<Graph id = "1" data = {data3} width = {500} height = {500} nodeName={"schemaNodes"} linkName={"schemaLinks"} nameClass = {"schemaGraph"}/>
														  
	    </Row>
							<Row>
							<Graph id = "2" data = {data2} width = {500} height = {500} nodeName={"queryNodes"} linkName={"queryLinks"} nameClass = {"queryGraph"}/>
	    </Row>
						</Col>
						<Col>Output result
	        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
								<Tab eventKey="rel" title="Relational output">
									<RelationalComponent data={[['first', 'second'], ['1', '2']]} />
								</Tab>
								<Tab eventKey="tree" title="XML output">
								<Graph id ="3" data={data1} width={500} height={500} tree={true} nodeName={"secondNodes"} linkName={"secondLinks"} nameClass = {"secondGraph"} />					
	    			</Tab> 
								<Tab eventKey="graph" title="Graph output">
								<Graph id = "4" data = {data2} width = {500} height = {500} nodeName={"firstNodes"} linkName={"firstLinks"} nameClass = {"firstGraph"}/>

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