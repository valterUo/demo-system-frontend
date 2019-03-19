import React, { Component } from 'react'
import { select } from 'd3-selection'
import { scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import store from '../../store'

const color = scaleOrdinal(schemeCategory10);

const updateNode = (selection) => {
    selection.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
}

const enterNode = (selection) => {
    selection.select('circle')
        .attr('r', 10)
        .style('fill', function (d) { return color(d.name) })
        .style('stroke', 'black')
        .style('stroke-width', '1')

    selection.select('text')
        .attr('dy', '.35em')
        .style('transform', 'translateX(-50%,-50%')
}

class Node extends Component {
    constructor(props) {
        super(props)
        this.nodeRef = React.createRef()
    }

    componentDidMount() {
        this.d3Node = select(this.nodeRef.current)
            .datum(this.props.data)
            .call(enterNode)
    }

    componentDidUpdate() {
        this.d3Node
            .datum(this.props.data)
            .call(updateNode)
    }

    handle(e) {
        //console.log(this.props.data + ' been clicked')
        let jsonData = this.props.data
        let filteredData = []
        for (const key in jsonData) {
            if (key !== "index") {
                const val = jsonData[key]
                filteredData.push({"key": key, "value": val})
            }
            else {
                break
            }
        }
        store.dispatch({ type: 'ADD_DATA', data: filteredData })
    }

    render() {
        return (
            <g ref={this.nodeRef} className={this.props.nodeName}>
                <circle onClick={this.handle.bind(this)} />
                <text>{this.props.data.name}</text>
            </g>
        )
    }
}

export default Node