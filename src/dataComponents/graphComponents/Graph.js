import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Node from './Node'
import Edge from './Edge'
import { select, selectAll } from 'd3-selection'
import { event } from 'd3-selection'
import { drag } from 'd3-drag'
import { forceSimulation, forceManyBody, forceCenter, forceLink, forceCollide } from 'd3-force'

class Graph extends Component {

    componentDidMount() {
        const updateNode = (selection) => {
            selection.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
        }

        const updateEdge = (selection) => {
            selection
                .attr('x1', (d) => d.source.x)
                .attr('y1', (d) => d.source.y)
                .attr('x2', (d) => d.target.x)
                .attr('y2', (d) => d.target.y);
        }

        const updateGraph = (selection) => {
            selection.selectAll('.node')
                .call(updateNode)
            selection.selectAll('.link')
                .call(updateEdge);
        }

        this.d3Graph = select(ReactDOM.findDOMNode(this));

        var force = forceSimulation(this.props.data.nodes)
            .force('charge', forceManyBody().strength(-50))
            .force('link', forceLink(this.props.data.links).distance(90))
            .force('center', forceCenter().x(this.props.width / 2).y(this.props.height / 2))
            .force('collide', forceCollide([5]).iterations([5]))

        function dragStarted(d) {
            if (!event.active) force.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
        }

        function dragging(d) {
            d.fx = event.x
            d.fy = event.y
        }

        function dragEnded(d) {
            if (!event.active) force.alphaTarget(0)
            d.fx = null
            d.fy = null
        }

        selectAll('g.node')
            .call(drag()
                .on('start', dragStarted)
                .on('drag', dragging)
                .on('end', dragEnded)
            )

        force.on('tick', () => {
            this.d3Graph.call(updateGraph)
        })
    }

    render() {
        var nodes = this.props.data.nodes.map((node) => {
            return (
                <Node data={node} name={node.name} key={node.id} />)
        })
        var links = this.props.data.links.map((link, i) => {
            return (
                <Edge key={link.target + link.source + i} data={link} />)
        })
        return (
            <svg className='graph' width={this.props.width} height={this.props.height}>
                <g>
                    {links}
                </g>
                <g>
                    {nodes}
                </g>
            </svg>
        );
    }
}

export default Graph