import React, { Component } from 'react'
import { select } from 'd3-selection'

const enterLink = (selection) => {
    selection.attr('stroke-width', 3)
        .style('stroke', 'black')
        .style('opacity', '.1')
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
        super(props);
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

    render() {
        return (
            <line ref = {this.edgeRef} className = {this.props.linkName} />
        )
    }
}

export default Edge