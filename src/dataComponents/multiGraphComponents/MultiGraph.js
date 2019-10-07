import React, { Component } from 'react'
import Node from '../graphComponents/Node'
import Multiedge from './MultiEdge'
import { select, selectAll } from 'd3-selection'
import { event } from 'd3-selection'
import { drag } from 'd3-drag'
import { forceSimulation, forceManyBody, forceCenter, forceLink, forceCollide, forceX, forceY } from 'd3-force'

class Graph extends Component {
    constructor(props) {
        super(props)
        this.graphRef = React.createRef()
    }

    componentDidMount() {
        const scaledwidth =  0.9 * this.props.width
        const scaledheigth = 0.6 * this.props.height
        const nodeName = this.props.nodeName
        const linkName = this.props.linkName

        const updateNode = (selection) => {
            selection.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
        }

        const updateMultiEdge = (selection) => {
            selection.select('path')
                .attr("d", function (d) {
                    let x1 = d.source.x, y1 = d.source.y,
                        x2 = d.target.x, y2 = d.target.y,
                        dx = x2 - x1, dy = y2 - y1, dr = 0
                    if (d.count > 1) {
                        dr = (1 / d.count - 1) * Math.sqrt(dx * dx + dy * dy)
                    }
                    let drx = dr, dry = dr,
                        xRotation = 0, largeArc = 0, sweep = 1
                    if (x1 === x2 && y1 === y2) {
                        xRotation = 45
                        largeArc = 1
                        sweep = 0
                        drx = 60
                        dry = 40
                        x2 = x2 + 1
                        y2 = y2 + 1
                    }
                    return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
                })

            selection.select("text").attr("dy", -5)
            selection.select("textPath")
                .style("text-anchor", "middle")
                .attr("startOffset", "50%")
        }

        const updateMultiGraph = (selection) => {
            selection.selectAll('.' + nodeName)
                .call(updateNode)
            selection.selectAll('.' + linkName)
                .call(updateMultiEdge)
        }

        this.d3Graph = select(this.graphRef.current)

        const force = forceSimulation().nodes(this.props.data.nodes)
            .force('charge', forceManyBody().strength(-100))
            .force('link', forceLink(this.props.data.links).distance(200))
            .force('center', forceCenter().x(scaledwidth / 2).y(scaledheigth / 2))
            .force('collide', forceCollide([90]).iterations([30]))
            .force("xAxis", forceX(scaledwidth / 2).strength(0.01))
            .force("yAxis", forceY(scaledheigth / 2).strength(0.01))

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
            this.d3Graph.call(updateMultiGraph)
        })

    }

    render() {
        const scaledwidth =  0.9 * this.props.width
        const scaledheigth = 0.6 * this.props.height
        const nodes = this.props.data.nodes.map((node) => {
            return (
                <Node data={node} name={node.name} key={node.id} nodeName={this.props.nodeName} editableGraph={this.props.editableGraph} />)
        })
        const links = this.props.data.links.map((link, i) => {
            return (
                <Multiedge key={i} data={link} linkName={this.props.linkName} />)
        })
        return (<div>
            <svg key={this.props.nameClass + 'Key'} className={this.props.nameClass} ref={this.graphRef} width={scaledwidth} height={scaledheigth}>
                <defs>
                    <marker id="multitriangle"
                        refX="21" refY="6"
                        markerWidth="100" markerHeight="100"
                        orient="auto" markerUnits="userSpaceOnUse">
                        <path d="M 0 0 12 6 0 12 3 6" fill="grey" />
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