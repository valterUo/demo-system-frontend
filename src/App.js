import React, { Component } from 'react'
import './App.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
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
//import { backgroundColorStyle, headerBackGroundColorStyle, fileInputStyle, fileInputLabelStyle, componentMarginalStyle, basicComponentsStyle } from './styles'
//import data1 from './exampleData/data1.json'
//import data2 from './exampleData/data2.json'

const backgroundColorStyle = {
	backgroundColor: "#f1f1f2"
}

const headerBackGroundColorStyle = {
	backgroundColor: "#A1D6E2",
	borderRadius: "5px",
	marginBottom: "12px",
	marginRight: "0px",
	marginLeft: "0px"
}

const fileInputStyle = {
	border: 0,
	clip: "rect(0, 0, 0, 0)",
	height: "1px",
	overflow: "hidden",
	padding: 0,
	position: "absolute",
	whiteSpace: "nowrap",
	width: "1px"
}

const fileInputLabelStyle = {
	backgroundColor: "#343a40",
	color: "#fff",
	marginRight: "4px",
	height: "36px",
	borderRadius: "5px",
	display: "inline-block",
	paddingLeft: "1rem",
	paddingRight: "1rem",
	lineHeight: "33px"
}

const componentMarginalStyle = {
	height: "0px",
	width: "100%",
	clear: "both"
}

const basicComponentsStyle = {
	backgroundColor: "#ffffff",
	borderStyle: "solid",
	borderRadius: "5px",
	borderColor: "#d9d9d9",
	borderWidth: "1px",
	marginTop: "12px",
	marginBottom: "12px",
	marginRight: "0px",
	marginLeft: "0px",
	align: "middle"
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

		return (<div>
			<Container style={backgroundColorStyle} fluid='true'>
				<Navbar style={headerBackGroundColorStyle} variant="light" expand="lg">
					<Navbar.Brand href="#home"><h3>Category Theory in Multi-model Databases</h3></Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse className="justify-content-end">
						<a href="https://www.helsinki.fi/en/researchgroups/unified-database-management-systems-udbms"> UDBMS </a>
						<div>&nbsp; &nbsp;</div>
						<a href="https://github.com/enorvio/demo-system">
							<img width="30" height="30" src={githubimage} alt="githublogo" />
						</a>
					</Navbar.Collapse>
				</Navbar>

				<Container fluid='true'>
					<Row style={basicComponentsStyle}>
						<Col xl={1}>
							<h4 align="right">Query Input</h4>
						</Col>
						<Col xl={6} style={{ align: "left" }}>
							<Form onSubmit={this.handleQuery} inline>
								<Form.Control type="text" placeholder="Enter query or choose defined query" value={this.state.query} onChange={this.handleQueryChange} style={{ width: "80%", marginRight: "5px" }} />
								<Button type="submit" variant="dark"> <i className='fas fa-play' style={{ fontSize: '24px' }}></i> </Button>
							</Form>
						</Col>
						<Col xl={3}>
							<Dropdown style={{ marginTop: "4px" }}>
								<Dropdown.Toggle variant="dark" id="dropdown-predefined-queries">
									Defined queries
  							</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item action variant="primary" onClick={() => this.selectQuery(1)}><code><pre>Select FirstName, LastName from Person where id = "933"</pre></code></Dropdown.Item>
									<Dropdown.Item action variant="primary" onClick={() => this.selectQuery(2)}><code><pre>.//invoice[personId="10995116278711"]/orderline</pre></code></Dropdown.Item>
									<Dropdown.Item action variant="primary" onClick={() => this.selectQuery(3)}><code><pre>MATCH (a:Person name: 'Jennifer')-[r:WORK_FOR]->(b:University)</pre> <pre>RETURN a, r, b</pre></code></Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</Col>
						<Col xl={2}>
							<Form onSubmit={this.handleFileSubmit}>
								<label style = {fileInputLabelStyle} for="fileInput">Select files</label>
								<input name="fileInput" id = "fileInput" style = {fileInputStyle} as='input' type="file" multiple="multiple" ref={this.file} />
								<Button type="submit" value="Submit" variant="dark"><i class='fas fa-upload' style={{ 'fontSize': '24px' }}></i></Button>
							</Form>
						</Col>
					</Row>
					<Row>
						<Col xl={6}>
							<Row style={basicComponentsStyle}>
								<h4>Schema</h4>
								<Graph id="1" data={data3} width={745} height={500} nodeName={"schemaNodes"} linkName={"schemaLinks"} nameClass={"schemaGraph"} />

							</Row>
							<div style={componentMarginalStyle}></div>
							<Row style={basicComponentsStyle}>
								<h4>Query schema</h4>
								<MultiGraph id="2" data={schema} width={745} height={500} nodeName={"queryNodes"} linkName={"queryLinks"} nameClass={"queryGraph"} />
							</Row>
						</Col>
						<Col xl={6}>
							<Row style={basicComponentsStyle}>
								<Col>
									<h4>Result:</h4>
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
								</Col>
							</Row>
							<div style={componentMarginalStyle}></div>
							<Row style={basicComponentsStyle}>
								<StatBox data={this.state.showedNodeData} />
							</Row>
						</Col>
					</Row>
					<MLarrowToGraph />
				</Container>
			</Container>
		</div>
		)
	}
}

export default App