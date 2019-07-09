import React, { Component } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import RelationalComponent from './relationalComponent'

class RelationalTabs extends Component {
    render() {
        if (this.props.tables === undefined) {
            return null
        } else {
            return <Tabs defaultActiveKey={this.props.tables[0].eventKey} id="uncontrolled-tab-relational-result">
                {this.props.tables.map(table => <Tab key={table.eventKey} eventKey={table.eventKey} title={table.title}>
                    <RelationalComponent width={this.props.width} height={this.props.height} key={table.eventKey} data={table.data} />
                </Tab>)}
            </Tabs>
        }
    }
}

export default RelationalTabs