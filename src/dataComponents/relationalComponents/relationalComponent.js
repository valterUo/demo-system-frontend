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
        const data = this.props.data
        const attributes = data[0]
        const dataData = data.filter(row => row !== attributes)
        
        select(table)
            .selectAll('table')
            .data([1])
            .enter()
            .append('table')
            .attr("class", "table")
            .append('thead')
            .attr('display', 'block')
            .append('tr')
            .selectAll('th')
            .data(attributes)
            .enter()
            .append('th')
            .text(d => d)

        select(table)
            .selectAll('table')
            .selectAll('tbody')
            .data([1])
            .enter()
            .append('tbody')
            .attr('display', 'block')
            .attr('max-height', '500px')
            .attr('overflow-y', 'scroll')
            .selectAll('tr')
            .data(dataData)
            .enter()
            .append('tr')
            .selectAll('td')
            .data(row => {
                return attributes.map((column, i) => {
                  return {column: column, value: row[i]}
                })
              })
            .enter()
            .append('td')
            .text(d => d.value)

    }

    render() {
        return <svg width={500} height={500}>
            <foreignObject width={500} height={500}>
                <div ref={table => this.table = table}>
                </div>
            </foreignObject>
        </svg>
    }
}

export default RelationalComponent