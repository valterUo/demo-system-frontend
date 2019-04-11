import React, { Component } from 'react'
import Node from './Node'
import Edge from './Edge'
import { select, selectAll } from 'd3-selection'
import { event } from 'd3-selection'
import { drag } from 'd3-drag'
import { forceSimulation, forceManyBody, forceCenter, forceLink, forceCollide } from 'd3-force'

class Graph extends Component {
    constructor(props) {
        super(props);
        this.graphRef = React.createRef()
    }

    componentDidMount() {
        const scaledwidth = 0.44*this.props.width
        const scaledheigth = 0.44*this.props.height
        const nodeName = this.props.nodeName
        const linkName = this.props.linkName

        const updateNode = (selection) => {
            selection.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
        }

        const updateEdge = (selection) => {
            selection.select('line')
                .attr('x1', (d) => d.source.x)
                .attr('y1', (d) => d.source.y)
                .attr('x2', (d) => d.target.x)
                .attr('y2', (d) => d.target.y)

            selection.select('text')
                .attr("x", function (d) {
                    return ((d.source.x + d.target.x) / 2)
                })
                .attr("y", function (d) {
                    return ((d.source.y + d.target.y) / 2)
                })
        }

        const updateGraph = (selection) => {
            selection.selectAll('.' + nodeName)
                .call(updateNode)
            selection.selectAll('.' + linkName)
                .call(updateEdge)
        }
        this.d3Graph = select(this.graphRef.current)

        const force = forceSimulation().nodes(this.props.data.nodes)
            .force('charge', forceManyBody().strength(-50))
            .force('link', forceLink(this.props.data.links).distance(100))
            .force('center', forceCenter().x(scaledwidth/2).y(scaledheigth/2))
            .force('collide', forceCollide([10]).iterations([10]))

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

        selectAll('g.' + nodeName)
            .call(drag()
                .on('start', dragStarted)
                .on('drag', dragging)
                .on('end', dragEnded)
            )

        force.on('tick', () => {
            this.d3Graph.call(updateGraph)
        })

    }

    handleClick() {
        //console.log("SVG clicked!")
    }

    render() {
        const scaledwidth = 0.44*this.props.width
        const scaledheigth = 0.44*this.props.height
        const nodes = this.props.data.nodes.map((node) => {
            return (
                <Node data={node} name={node.name} key={this.props.nodeName + node.id} nodeName={this.props.nodeName} editableGraph = {this.props.editableGraph} />)
        })
        const links = this.props.data.links.map((link, i) => {
            return (
                <Edge key={i} data={link} linkName={this.props.linkName} />)
        })
        return (<div>
            <svg key = {this.props.nameClass + 'Key'} className={this.props.nameClass} ref={this.graphRef} width={scaledwidth} height={scaledheigth} onClick = {this.handleClick}>
                <defs>
                    <marker id="triangle"
                        refX="21" refY="6"
                        markerWidth="100" markerHeight="100"
                        orient="auto" markerUnits="userSpaceOnUse">
                        <path d="M 0 0 12 6 0 12 3 6" fill="black" />
                    </marker>
                </defs>
                <g>
                    {links}
                </g>
                <g>
                    {nodes}
                </g>
            </svg>
        </div>
        )
    }
}

export default Graph