import React, { Component } from 'react'
import { select } from 'd3-selection'

const enterLink = (selection) => {

    selection.select('path')
        .attr('stroke-width', 2)
        .style('stroke', 'grey')
        .attr("fill", "none")
        .attr("marker-end", "url(#triangle)")

    selection.select('text')
        .attr('dy', '.35em')
        .style('transform', 'translateX(-50%,-50%')
        .attr("text-anchor", "middle")
}

const updateLink = (selection) => {
    selection
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)
}

class Edge extends Component {
    constructor(props) {
        super(props)
        this.edgeRef = React.createRef()
    }

    componentDidMount() {
        this.d3Link = select(this.edgeRef.current)
            .datum(this.props.data)
            .call(enterLink)
    }

    componentDidUpdate() {
        this.d3Link.datum(this.props.data)
            .call(updateLink)
    }

    handle(e) {
        console.log(this.props + ' been clicked')
    }

    render() {
        if (this.props.data.name !== undefined) {
            return (
                <g ref={this.edgeRef} className={this.props.linkName}>
                    <path onClick={this.handle.bind(this)} />
                    <text>{this.props.data.name}</text>
                </g>
            )
        }
        else {
            return (
                <g ref={this.edgeRef} className={this.props.linkName}>
                    <path onClick={this.handle.bind(this)} />
                </g>
            )
        }
    }
}

export default Edge