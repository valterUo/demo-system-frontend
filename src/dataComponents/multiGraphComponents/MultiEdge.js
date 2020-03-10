import React, { Component } from 'react'
import { select } from 'd3-selection'
import store from '../../store'

class MultiEdge extends Component {
    constructor(props) {
        super(props)
        this.edgeRef = React.createRef()
    }

    updateLink = (selection) => {
        selection
            .attr('x1', (d) => d.source.x)
            .attr('y1', (d) => d.source.y)
            .attr('x2', (d) => d.target.x)
            .attr('y2', (d) => d.target.y)
    }

    componentDidMount() {
        this.d3Link = select(this.edgeRef.current)
            .datum(this.props.data)
            .call(this.enterLink)
    }

    componentDidUpdate() {
        this.d3Link.datum(this.props.data)
            .call(this.updateLink)
    }

    enterLink = (selection) => {
        selection.select('path')
            .attr('stroke-width', 2)
            .style('stroke', 'grey')
            .attr("fill", "none")
            .attr("marker-end", "url(#multitriangle" + this.props.linkName + ")")

            selection.select('text')
            .attr('dy', '.35em')
            .style('transform', 'translateX(-50%,-50%')
            .attr("text-anchor", "middle")
    }

    handleMouseEntering = () => {
        if(this.props.showEdgeLabels) {
        this.d3Link.select('text')
        .attr("visibility", "visible")
        .attr('dy', '.35em')
        .style('transform', 'translateX(-50%,-50%')
        .attr("text-anchor", "middle")
    }
        this.d3Link.select('path')
            .attr('stroke-width', 5)
            .style('stroke', '#666666')
            .attr("fill", "none")
        
        store.dispatch({ type: 'SHOW_NODE_EDGE_DATA', data: [{ "key": "label", "value": this.props.data.name }], header: "Edge" })
    }

    handleMouseExiting = () => {
        if(this.props.showEdgeLabels) {
        this.d3Link.select("text")
            .attr("visibility", "hidden")
        }
        this.d3Link.select('path')
            .attr('stroke-width', 2)
            .style('stroke', 'grey')
            .attr("fill", "none")
        
    }

    handle(e) {
        console.log(this.props + ' been clicked')
    }

    render() {
        let pathId
        (this.props.edgekey !== undefined) ? pathId = this.props.edgekey : pathId = this.props.data.name
        if (this.props.data.name !== undefined) {
            return (
                <g ref={this.edgeRef} className={this.props.linkName} onMouseEnter={this.handleMouseEntering.bind(this)} onMouseLeave={this.handleMouseExiting.bind(this)}>
                    <path id={pathId} onClick={this.handle.bind(this)} />
                    <text visibility="hidden">{this.props.data.name}</text>
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