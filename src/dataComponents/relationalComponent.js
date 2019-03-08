import React, { Component } from 'react'
import { select } from 'd3-selection'

class RelationalComponent extends Component {
    constructor(props) {
        super(props)
        this.createRelationalComponent = this.createRelationalComponent.bind(this)
    }

    componentDidMount() {
        this.createRelationalComponent()
    }

    componentDidUpdate() {
        this.createRelationalComponent()
    }

    createRelationalComponent() {
        const table = this.table
        const attributes = this.props.data[0]
        const dataData = this.props.data[1]

        select(table)
            .selectAll('Table')
            .data([1])
            .enter()
            .append('table')
            .attr("class", "table")
            .append('thead')
            .append('tr')
            .selectAll('th')
            .data(attributes)
            .enter()
            .append('th')
            .text(d => d)

        select(table)
            .selectAll('Table')
            .selectAll('tbody')
            .data([1])
            .enter()
            .append('tbody')
            .append('tr')
            .selectAll('td')
            .data(dataData)
            .enter()
            .append('td')
            .text(d => d)

    }

    render() {
        return <svg width={500} height={500}>
        <foreignObject  width={500} height={500}>
        <div ref = {table => this.table = table}>
        </div>
      </foreignObject> 
      </svg>
    }
}

export default RelationalComponent
