import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { Navbar } from 'react-bootstrap';
import githubimage from './GitHub-Mark-64px.png'

class App extends Component {

    render() {
	return (
	    <Container fluid = 'true'>
	      <Navbar bg="light" expand="lg">
		<Navbar.Brand href="#home">Category Theory in Multi-model Databases</Navbar.Brand>
		<Navbar.Toggle aria-controls="basic-navbar-nav" />
		<Navbar.Collapse className="justify-content-end">
		<a href = "https://www.helsinki.fi/en/researchgroups/unified-database-management-systems-udbms">
		UDBMS
	        </a>
		<div>&nbsp; &nbsp;</div>
		<a href = "https://github.com/enorvio/demo-system">
		<img width="30" height="30" src={githubimage} alt="githublogo"/>
		</a>
		</Navbar.Collapse>
	      </Navbar>
	      <Container fluid = 'true'>
		<Row>
		  <Col>Input of the query</Col>
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
			Relational Data
		      </Tab>
		      <Tab eventKey="tree" title="XML output">
			Document Data
		      </Tab>
		      <Tab eventKey="graph" title="Graph output">
			Graph Data
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
