import React, { Component } from 'react'
import { select } from 'd3-selection'
import { scaleOrdinal } from 'd3-scale'
import { transition } from 'd3-transition' // eslint-disable-line
import { schemeCategory10 } from 'd3-scale-chromatic'
import { arc } from 'd3-shape'
import store from '../../store'

const color = scaleOrdinal(schemeCategory10)

const updateNode = (selection) => {
    selection.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
}

const enterNode = (selection) => {
    const pi = 3.1415
    const outerRadius = 45

    selection.select('circle')
        .attr('r', 10)
        .style('fill', function (d) { return color(d.name) })
        .style('stroke', 'black')
        .style('stroke-width', '1')

    selection.select('text')
        .attr('dy', '.4em')
        .attr('dx', '.8em')
        .style('transform', 'translateX(-50%,-50%')

    selection.select('g')
        .select(".addEdge")
        .attr("d", arc()
            .innerRadius(10)
            .outerRadius(outerRadius)
            .startAngle(0)
            .endAngle(pi / 2)
        )
        .attr('stroke', 'black')
        .style('stroke-width', '1')
        .attr('fill', '#69b3a2')

    selection.select(".addEdgeLabel")
        .attr("transform", "translate(10, -30)")

    selection.select('g')
        .select(".removeNode")
        .attr("d", arc()
            .innerRadius(10)
            .outerRadius(outerRadius)
            .startAngle(pi / 2)
            .endAngle(pi)
        )
        .attr('stroke', 'black')
        .style('stroke-width', '1')
        .attr('fill', '#69b3a2')

    selection.select(".removeNodeLabel")
        .attr("transform", "translate(7, 5)")

    selection.select('g')
        .select(".removeEdges")
        .attr("d", arc()
            .innerRadius(10)
            .outerRadius(outerRadius)
            .startAngle(pi)
            .endAngle(1.5 * pi)
        )
        .attr('stroke', 'black')
        .style('stroke-width', '1')
        .attr('fill', '#69b3a2')

    selection.select(".removeEdgesLabel")
        .attr("transform", "translate(-27, 11)")

    selection.select('g')
        .select(".addNodeStartingFromThisNode")
        .attr("d", arc()
            .innerRadius(10)
            .outerRadius(outerRadius)
            .startAngle(1.5 * pi)
            .endAngle(2 * pi)
        )
        .attr('stroke', 'black')
        .style('stroke-width', '1')
        .attr('fill', '#69b3a2')

    selection.select(".addNodeStartingFromThisNodeLabel")
        .attr("transform", "translate(-30, -30)")

}

class Node extends Component {
    constructor(props) {
        super(props)
        this.nodeRef = React.createRef()
    }

    componentDidMount() {
        this.d3Node = select(this.nodeRef.current)
            .datum(this.props.data)
            .call(enterNode)
    }

    componentDidUpdate() {
        this.d3Node
            .datum(this.props.data)
            .call(updateNode)
    }

    handle(e) {
        let jsonData = this.props.data
        let filteredData = []
        for (const key in jsonData) {
            if (key !== "index") {
                const val = jsonData[key]
                filteredData.push({ "key": key, "value": val })
            }
            else {
                break
            }
        }
        if (JSON.stringify(store.getState().nodeData.data) !== JSON.stringify(filteredData)) {
            store.dispatch({ type: 'ADD_NODE_DATA', data: filteredData })
        }
        this.d3Node.select("circle").style("fill", "#FCBC34")
    }

    handleColorChangeBack(e) {
        this.d3Node.select('circle').style('fill', d => color(d.name))
    }

    showNodeHandlingButtons() {
        if (this.props.editableGraph) {
            if (this.d3Node.select(".nodeHandlingButtons").attr("visibility") === "hidden") {
                this.d3Node.select(".nodeHandlingButtons").attr("visibility", "visible").transition().duration(500).attr("opacity", 1)
            } else {
                this.d3Node.select(".nodeHandlingButtons").transition().duration(500).attr("opacity", 0)
                setTimeout(() => { this.d3Node.select(".nodeHandlingButtons").attr("visibility", "hidden") }, 501)
                store.dispatch({ type: 'DELETE_NODE_MODEL' })
            }
        }
    }

    changeNodeHandlingButtonColorEnter(name) {
        this.d3Node.select("." + name).select("path").style("fill", "#FCBC34")
    }

    changeNodeHandlingButtonColorExit(name) {
        this.d3Node.select("." + name).select("path").style("fill", "#69b3a2")
    }

    handleAddEdge() {
        console.log(this.props.data)
        store.dispatch({ type: 'ACCEPT_EDGE_DRAWING', acceptEdgeDrawing: true })
        store.dispatch({ type: 'ADD_STARTING_EDGE', startingEdge: this.props.data })
        this.showNodeHandlingButtons()
    }

    handleRemoveNode() {
        let oldData = store.getState().schemaData.schema
        const newNodes = oldData.nodes.filter(node => JSON.stringify(node) !== JSON.stringify(this.props.data))
        const newLinks = oldData.links.filter(link => JSON.stringify(link.source) !== JSON.stringify(this.props.data) && JSON.stringify(link.target) !== JSON.stringify(this.props.data))
        store.dispatch({ type: "ADD_SCHEMA_DATA", data: { nodes: newNodes, links: newLinks }, key: "removedNodeKey" + newNodes.length })
        this.showNodeHandlingButtons()
    }

    handleRemoveEdges() {
        let oldData = store.getState().schemaData.schema
        const newLinks = oldData.links.filter(link => JSON.stringify(link.source) !== JSON.stringify(this.props.data) && JSON.stringify(link.target) !== JSON.stringify(this.props.data))
        store.dispatch({ type: "ADD_SCHEMA_DATA", data: { nodes: oldData.nodes, links: newLinks }, key: "removedEdgesKey" + newLinks.length })
        this.showNodeHandlingButtons()
    }

    handleAddNodeStartingFromThisNode() {
        let newNode = {}
        for (const key in this.props.data) {
            if (key !== "index") {
                newNode[key] = ""
            }
            else {
                break
            }
        }
        store.dispatch({ type: 'ADD_NODE_MODEL', textFieldVisible: true, nodeModel: newNode, sourceNode: this.props.data })
    }

    render() {
        return (
            <g ref={this.nodeRef} className={this.props.nodeName}>
                <circle onMouseEnter={this.handle.bind(this)} onMouseLeave={this.handleColorChangeBack.bind(this)} onClick={this.showNodeHandlingButtons.bind(this)} />
                <text>{this.props.data.name}</text>

                <g className="nodeHandlingButtons" display="block" visibility="hidden" opacity="0" >
                    <g className="addEdgeElement" onClick={this.handleAddEdge.bind(this)} onMouseEnter={() => this.changeNodeHandlingButtonColorEnter("addEdgeElement")}
                        onMouseLeave={() => this.changeNodeHandlingButtonColorExit("addEdgeElement")}>
                        <path className="addEdge" />
                        <foreignObject className="addEdgeLabel" width="30" height="30">
                            <i className='fas fa-external-link-alt' style={{ "fontSize": "18px" }}></i>
                        </foreignObject>
                    </g>
                    <g className="removeNodeElement" onClick={this.handleRemoveNode.bind(this)} onMouseEnter={() => this.changeNodeHandlingButtonColorEnter("removeNodeElement")}
                        onMouseLeave={() => this.changeNodeHandlingButtonColorExit("removeNodeElement")}>
                        <path className="removeNode" />
                        <foreignObject className="removeNodeLabel" width="30" height="30">
                            <i className="material-icons" style={{ "fontSize": "28px" }}>delete_forever</i>
                        </foreignObject>
                    </g>
                    <g className="removeEdgesElement" onClick={this.handleRemoveEdges.bind(this)} onMouseEnter={() => this.changeNodeHandlingButtonColorEnter("removeEdgesElement")}
                        onMouseLeave={() => this.changeNodeHandlingButtonColorExit("removeEdgesElement")}>
                        <path className="removeEdges" />
                        <foreignObject className="removeEdgesLabel" width="30" height="30">
                            <i className='fas fa-unlink' style={{ "fontSize": "18px" }}></i>
                        </foreignObject>
                    </g>
                    <g className="addNodeStartingFromThisNodeElement" onClick={this.handleAddNodeStartingFromThisNode.bind(this)} onMouseEnter={() => this.changeNodeHandlingButtonColorEnter("addNodeStartingFromThisNodeElement")}
                        onMouseLeave={() => this.changeNodeHandlingButtonColorExit("addNodeStartingFromThisNodeElement")}>
                        <path className="addNodeStartingFromThisNode" />
                        <foreignObject className="addNodeStartingFromThisNodeLabel" width="26" height="23">
                            <i className='fas fa-plus-circle' style={{ "fontSize": "22px" }}></i>
                        </foreignObject>
                    </g>
                </g>
            </g>
        )
    }
}

export default Node