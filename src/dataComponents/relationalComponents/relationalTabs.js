import React, { Component } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import RelationalComponent from './relationalComponent'

class RelationalTabs extends Component {
    render() {
        console.log(this.props.tables)
        return <Tabs defaultActiveKey= {this.props.tables[0].eventKey} id="uncontrolled-tab-example">
            {this.props.tables.map(table => <Tab key = {table.eventKey} eventKey={table.eventKey} title={table.title}> <RelationalComponent data={table.data} /> </Tab>)}
        </Tabs>
    }
}

export default RelationalTabs