import React, { Component } from 'react'
import { select } from 'd3-selection'
import { scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { arc } from 'd3-shape'
import store from '../../store'

const color = scaleOrdinal(schemeCategory10)

const updateNode = (selection) => {
    selection.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
}

const enterNode = (selection) => {
    const pi = 3.1415

    selection.select('circle')
        .attr('r', 10)
        .style('fill', function (d) { return color(d.name) })
        .style('stroke', 'black')
        .style('stroke-width', '1')

    selection.select('text')
        .attr('dy', '.35em')
        .style('transform', 'translateX(-50%,-50%')

    selection.select('g')
        .select(".addEdge")
        .attr("d", arc()
            .innerRadius(10)
            .outerRadius(25)
            .startAngle(0)
            .endAngle(pi / 2)
        )
        .attr('stroke', 'black')
        .style('stroke-width', '1')
        .attr('fill', '#69b3a2')

    selection.select(".addEdgeLabel")
        .attr("y", -9)

    selection.select('g')
        .select(".removeNode")
        .attr("d", arc()
            .innerRadius(10)
            .outerRadius(25)
            .startAngle(pi / 2)
            .endAngle(pi)
        )
        .attr('stroke', 'black')
        .style('stroke-width', '1')
        .attr('fill', '#69b3a2')

    selection.select(".removeNodeLabel")
        .attr("transform", "translate(5, 15)")

    selection.select('g')
        .select(".removeEdges")
        .attr("d", arc()
            .innerRadius(10)
            .outerRadius(25)
            .startAngle(pi)
            .endAngle(1.5 * pi)
        )
        .attr('stroke', 'black')
        .style('stroke-width', '1')
        .attr('fill', '#69b3a2')

    selection.select(".removeEdgesLabel")
        .attr("transform", "translate(-21, 15)")

    selection.select('g')
        .select(".addNodeStartingFromThisNode")
        .attr("d", arc()
            .innerRadius(10)
            .outerRadius(25)
            .startAngle(1.5 * pi)
            .endAngle(2 * pi)
        )
        .attr('stroke', 'black')
        .style('stroke-width', '1')
        .attr('fill', '#69b3a2')

    selection.select(".addNodeStartingFromThisNodeLabel")
        .attr("transform", "translate(-21, -9)")

}

class Node extends Component {
    constructor(props) {
        super(props)
        this.state = { hovered: false }
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
        if(JSON.stringify(store.getState().nodeData.data) !== JSON.stringify(filteredData)){
            store.dispatch({ type: 'ADD_NODE_DATA', data: filteredData })
        }
        this.d3Node.select("circle").style("fill", "#FCBC34")
    }

    handleColorChangeBack(e) {
        this.d3Node.select('circle').style('fill', d => color(d.name))
    }

    showNodeHandlingButtons() {
        if (this.props.editableGraph) {
            if (this.d3Node.select(".nodeHandlingButtons").attr("display") === "none") {
                this.d3Node.select(".nodeHandlingButtons").attr("display", "block")
            } else {
                this.d3Node.select(".nodeHandlingButtons").attr("display", "none")
                store.dispatch({type: 'DELETE_NODE_MODEL'})
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

                <g className="nodeHandlingButtons" display="none">
                    <g className = "addEdgeElement" onClick={this.handleAddEdge.bind(this)} onMouseEnter={() => this.changeNodeHandlingButtonColorEnter("addEdgeElement")} 
                    onMouseLeave={() => this.changeNodeHandlingButtonColorExit("addEdgeElement")}>
                        <path className="addEdge" />
                        <text className="addEdgeLabel">+e</text>
                    </g>
                    <g className = "removeNodeElement" onClick={this.handleRemoveNode.bind(this)} onMouseEnter={() => this.changeNodeHandlingButtonColorEnter("removeNodeElement")} 
                    onMouseLeave={() => this.changeNodeHandlingButtonColorExit("removeNodeElement")}>
                        <path className="removeNode" />
                        <text className="removeNodeLabel">-n</text>
                    </g>
                    <g className = "removeEdgesElement" onClick={this.handleRemoveEdges.bind(this)} onMouseEnter={() => this.changeNodeHandlingButtonColorEnter("removeEdgesElement")} 
                    onMouseLeave={() => this.changeNodeHandlingButtonColorExit("removeEdgesElement")}>
                        <path className="removeEdges" />
                        <text className="removeEdgesLabel">-e</text>
                    </g>
                    <g className = "addNodeStartingFromThisNodeElement" onClick={this.handleAddNodeStartingFromThisNode.bind(this)} onMouseEnter={() => this.changeNodeHandlingButtonColorEnter("addNodeStartingFromThisNodeElement")} 
                    onMouseLeave={() => this.changeNodeHandlingButtonColorExit("addNodeStartingFromThisNodeElement")}>
                        <path className="addNodeStartingFromThisNode" />
                        <text className="addNodeStartingFromThisNodeLabel">+n</text>
                    </g>
                </g>
            </g>
        )
    }
}

export default Node