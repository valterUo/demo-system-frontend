import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { select } from 'd3-selection'
import { scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'

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

    componentDidMount() {
        this.d3Node = select(ReactDOM.findDOMNode(this))
            .datum(this.props.data)
            .call(enterNode)
    }

    componentDidUpdate() {
        this.d3Node.datum(this.props.data)
            .call(updateNode)
    }

    handle(e) {
        console.log(this.props.data.id + ' been clicked')
    }

    render() {
        return (
            <g className='node'>
                <circle ref='dragMe' onClick={this.handle.bind(this)} />
                <text>{this.props.data.name}</text>
            </g>
        );
    }
}

export default Node