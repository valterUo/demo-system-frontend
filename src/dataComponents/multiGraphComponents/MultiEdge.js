import React, { Component } from 'react'
import { select } from 'd3-selection'

const enterLink = (selection) => {

    selection.select('path')
        .attr('stroke-width', 2)
        .style('stroke', 'grey')
        .attr("fill", "none")
        .attr("marker-end", "url(#multitriangle)")

    selection.select('text')
        .style('transform', 'translateX(-50%,-50%')
        .attr("text-anchor", "middle")
}

class MultiEdge extends Component {
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
    }

    handleMouseEntering = () => {
        this.d3Link.select("text")
            .attr("visibility", "visible")
        this.d3Link.select('path')
            .attr('stroke-width', 5)
            .style('stroke', '#666666')
            .attr("fill", "none")
    }

    handleMouseExiting = () => {
        this.d3Link.select("text")
            .attr("visibility", "hidden")
        this.d3Link.select('path')
            .attr('stroke-width', 2)
            .style('stroke', 'grey')
            .attr("fill", "none")
    }

    handle(e) {
        console.log(this.props + ' been clicked')
    }

    render() {
        if (this.props.data.name !== undefined) {
            return (
                <g ref={this.edgeRef} className={this.props.linkName} onMouseEnter={this.handleMouseEntering.bind(this)} onMouseLeave={this.handleMouseExiting.bind(this)}>
                    <path id={this.props.data.name} onClick={this.handle.bind(this)} />
                    <text visibility="hidden"><textPath href={"#" + this.props.data.name} style={{ textAnchor: "middle" }} >{this.props.data.name}</textPath></text>
                </g>
            )
        }
        else {
            return (
                <g ref={this.edgeRef} className={this.props.linkName} onMouseEnter={() => this.handleMouseEntering} onMouseLeave={() => this.handleMouseExiting}>
                    <path onClick={this.handle.bind(this)} />
                </g>
            )
        }
    }
}

export default MultiEdge