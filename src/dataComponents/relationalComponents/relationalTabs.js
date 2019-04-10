import React, { Component } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import RelationalComponent from './relationalComponent'

class RelationalTabs extends Component {
    render() {
        const filteredTables = this.props.tables.filter(table => table.data[0].length > 0)
        return <Tabs defaultActiveKey={this.props.tables[0].eventKey} id="uncontrolled-tab-example">
            {filteredTables.map(table => <Tab key={table.eventKey} eventKey={table.eventKey} title={table.title}>
                <RelationalComponent width = {this.props.width} height = {this.props.height} key={table.eventKey} data={table.data} />
            </Tab>)}
        </Tabs>
    }
}

export default RelationalTabs