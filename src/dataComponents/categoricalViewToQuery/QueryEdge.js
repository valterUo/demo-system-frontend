import React, { Component } from 'react'
import { select } from 'd3-selection'

const enterLink = (selection) => {



    selection.select('text')
        .attr('dy', '.5em')
        .style('transform', 'translateX(-50%,-50%')
        .attr("text-anchor", "middle")
        //.attr('font-weight', 'bold')

    selection.select('path')
        .attr('stroke-width', 2)
        .style('stroke', 'gray')
        .attr("fill", "none")
        .attr("marker-end", "url(#triangle)")
}

const updateLink = (selection) => {
    selection
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)
}

class QueryEdge extends Component {
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
                    <text><tspan style = {{"font-weight":"bold"}}>{this.props.data.name}</tspan></text>
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

export default QueryEdge