import React, { Component } from 'react'
import QueryNode from './QueryNode'
import QueryEdge from './QueryEdge'
import { select, selectAll, event } from 'd3-selection'
import { drag } from 'd3-drag'
import { forceSimulation, forceManyBody, forceCenter, forceLink, forceCollide, forceX, forceY } from 'd3-force'

class QueryGraph extends Component {
    constructor(props) {
        super(props)
        this.graphRef = React.createRef()
    }

    componentDidMount() {
        console.log(this.props.data.nodes)
        const scaledwidth = 0.67 * this.props.width
        const scaledheigth = 0.6 * this.props.height
        const nodeName = this.props.nodeName
        const linkName = this.props.linkName

        const updateNode = (selection) => {
            selection.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
        }

        const updateEdge = (selection) => {
            selection.select('path')
                .attr("d", function (d) {
                    let x1 = d.source.x,
                        y1 = d.source.y,
                        x2 = d.target.x,
                        y2 = d.target.y,
                        drx = 0,
                        dry = 0,
                        xRotation = 0,
                        largeArc = 0

                    if (x1 === x2 && y1 === y2) {
                        xRotation = 45
                        largeArc = 1
                        drx = 60 / 2
                        dry = 40 / 2
                        x2 = x2 + 1
                        y2 = y2 + 1
                    }

                    return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + ", 1 " + x2 + "," + y2;
                })

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
            .force('charge', forceManyBody().strength(-150))
            .force('link', forceLink(this.props.data.links).distance(100))
            .force('center', forceCenter().x(scaledwidth / 2).y(scaledheigth / 2))
            .force('collide', forceCollide([10]).iterations([10]))
            .force("xAxis", forceX(scaledwidth / 2).strength(0.05))
            .force("yAxis", forceY(scaledheigth / 2).strength(0.05))

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

    render() {
        const scaledwidth = 0.67 * this.props.width
        const scaledheigth = 0.6 * this.props.height
        const nodes = this.props.data.nodes.map((node, i) => {
            return (
                <QueryNode data={node} name={node.name} key={node.id === undefined ? i : node.id} nodeName={this.props.nodeName} handleDataChange = {this.props.handleDataChange.bind(this)} />)
        })
        const links = this.props.data.links.map((link, i) => {
            return (
                <QueryEdge key={link.id === undefined ? i : link.id} data={link} linkName={this.props.linkName} />)
        })
        return (<div>
            <svg key={this.props.nameClass + 'Key'} className={this.props.nameClass} ref={this.graphRef} width={scaledwidth} height={scaledheigth}>
                <defs>
                    <marker id="triangle"
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

export default QueryGraph