import React, { Component } from 'react'
import Node from './Vertex'
import Edge from './Arc'
import { select, selectAll } from 'd3-selection'
import { event } from 'd3-selection'
import { drag } from 'd3-drag'
import { forceSimulation, forceManyBody, forceCenter, forceLink, forceCollide } from 'd3-force'

class Tree extends Component {
    constructor(props) {
        super(props)
        this.graphRef = React.createRef()
    }

    componentDidMount() {
        const nodeName = this.props.nodeName
        const linkName = this.props.linkName
        this.d3Graph = select(this.graphRef.current)
        console.log(this.d3Graph)

        const force = forceSimulation().nodes(this.props.data.nodes)
            .force('charge', forceManyBody().strength(-100))
            .force('link', forceLink(this.props.data.links).distance(80))
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

        selectAll('g.' + nodeName)
            .call(drag()
                .on('start', dragStarted)
                .on('drag', dragging)
                .on('end', dragEnded)
            )

            force.on('tick', () => {
                this.d3Graph.call(tick)
            })

        const tick = (selection) => {
            const k = 6 * force.tick().alpha()

            selection.selectAll('.' + linkName)
                .each((d) => {
                    d.source.y -= k
                    d.target.y += k
                })
                .attr("x1", function (d) { return d.source.x })
                .attr("y1", function (d) { return d.source.y })
                .attr("x2", function (d) { return d.target.x })
                .attr("y2", function (d) { return d.target.y })

            selection.selectAll('.' + nodeName)
                .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
        }
    }

    render() {
        const nodes = this.props.data.nodes.map((node, i) => {
            return (
                <Node data={node} name={node.name} key={node.id + i} nodeName={this.props.nodeName} />)
        })
        const links = this.props.data.links.map((link, i) => {
            return (
                <Edge key={i} data={link} linkName={this.props.linkName} />)
        })
        return (
            <svg className={this.props.nameClass} ref={this.graphRef} width={this.props.width} height={this.props.height}>
                <g>
                    {links}
                </g>
                <g>
                    {nodes}
                </g>
            </svg>
        )
    }
}

export default Tree