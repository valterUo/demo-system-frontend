import React, { Component } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import RelationalComponent from './relationalComponent'


class RelationalTabs extends Component {

    render() {
        if (this.props.data === undefined) {
            return null
        } else {
            const result = this.props.data
            return <Tabs defaultActiveKey={JSON.stringify(result[0][0])} id="uncontrolled-tab-relational-result">
                {result.map(table => <Tab key={JSON.stringify(table[0])} eventKey={JSON.stringify(table[0])} title={"Result"}>
                    <RelationalComponent width={this.props.width} height={this.props.height} key={JSON.stringify(table[0])} data={table} />
                </Tab>)}
            </Tabs>
        }
    }
}

export default RelationalTabs