import React, { Component } from 'react'
import Node from '../graphComponents/Node'
import Multiedge from './MultiEdge'
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
        const scaledwith = 0.44*this.props.width
        const scaledheight = 0.44*this.props.height
        const nodeName = this.props.nodeName
        const linkName = this.props.linkName

        const updateNode = (selection) => {
            selection.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
        }

        const updateMultiEdge = (selection) => {
            selection.select('path')
                .attr("d", function (d) {
                    let x1 = d.source.x,
                        y1 = d.source.y,
                        x2 = d.target.x,
                        y2 = d.target.y,
                        dx = x2 - x1,
                        dy = y2 - y1,
                        dr = 0
                        // Set dr to 0 for straight edges.
                        // Set dr to Math.sqrt(dx * dx + dy * dy) for a simple curve.
                        // Assuming a simple curve, decrease dr to space curves.
                        // There's probably a better decay function that spaces things nice and evenly. 
                        if(d.count !== 1){
                            dr = Math.sqrt(dx * dx + dy * dy)
                        }

                    let  drx = dr,
                        dry = dr,
                        xRotation = 0,
                        largeArc = 0,
                        sweep = 1

                    if (x1 === x2 && y1 === y2) {
                        xRotation = -45
                        largeArc = 1
                        //sweep = 0
                        drx = 30
                        dry = 20
                        x2 = x2 + 1
                        y2 = y2 + 1 
                    }

                    return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
                })

            selection.select('text')
                .attr("x", function (d) {
                    let x1 = d.source.x,
                        y1 = d.source.y,
                        x2 = d.target.x,
                        y2 = d.target.y,
                        dx = x2 - x1

                        if(d.count !== 1) {
                            return ((d.source.x + d.target.x + dx/2) / 2)
                        }
                        if (x1 === x2 && y1 === y2) {
                            return ((d.source.x + d.target.x + 80) / 2)
                        }
                    return ((d.source.x + d.target.x) / 2)
                })
                .attr("y", function (d) {
                    let x1 = d.source.x,
                        y1 = d.source.y,
                        x2 = d.target.x,
                        y2 = d.target.y,
                        dy = y2 - y1

                        if(d.count !== 1) {
                            return ((d.source.y + d.target.y + dy/2) / 2)
                        }
                        if (x1 === x2 && y1 === y2) {
                            return ((d.source.y + d.target.y - 60) / 2)
                        }
                    return ((d.source.y + d.target.y) / 2)
                })
        }

        const updateMultiGraph = (selection) => {
            selection.selectAll('.' + nodeName)
                .call(updateNode)
            selection.selectAll('.' + linkName)
                .call(updateMultiEdge)
        }

        this.d3Graph = select(this.graphRef.current)

        const force = forceSimulation().nodes(this.props.data.nodes)
            .force('charge', forceManyBody().strength(-50))
            .force('link', forceLink(this.props.data.links).distance(200))
            .force('center', forceCenter().x(scaledwith / 2).y(scaledheight / 2))
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
            this.d3Graph.call(updateMultiGraph)
        })

    }

    render() {
        const scaledwith = 0.44*this.props.width
        const scaledheight = 0.44*this.props.height
        const nodes = this.props.data.nodes.map((node) => {
            return (
                <Node data={node} name={node.name} key={node.id} nodeName={this.props.nodeName} editableGraph = {this.props.editableGraph} />)
        })
        const links = this.props.data.links.map((link, i) => {
            return (
                <Multiedge key={i} data={link} linkName={this.props.linkName} />)
        })
        return (<div>
            <svg className={this.props.nameClass} ref={this.graphRef} width={scaledwith} height={scaledheight}>
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