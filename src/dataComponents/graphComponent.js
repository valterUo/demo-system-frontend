import React, { Component } from 'react'
import { select } from 'd3-selection'
import { scaleOrdinal } from 'd3-scale'
import { event } from 'd3-selection'
import { drag } from 'd3-drag'
import { forceSimulation, forceManyBody, forceCenter, forceLink } from 'd3-force'

class GraphComponent extends Component {
    constructor(props) {
        super(props)
        this.createGraphComponent = this.createGraphComponent.bind(this)
    }

    componentDidMount() {
        this.createGraphComponent()
    }

    componentDidUpdate() {
        this.createGraphComponent()
    }

    createGraphComponent() {
        const graph = this.graph
        const nodes = this.props.data.nodes
        const edges = this.props.data.edges
        const roleScale = scaleOrdinal().range(["#75739F", "#41A368", "#FE9922"])

        const fforce = forceSimulation()
            .force("charge", forceManyBody().strength(-40))
            .force("center", forceCenter().x(300).y(300))
            .force("link", forceLink())
            .nodes(nodes)
            .on("tick", updateGraph());

            fforce.force("link").links(edges)
            

        select(graph)
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .style("fill", (d, i) => roleScale(i))
            .attr("r", 5)
            .call(drag(fforce))

        select(graph)
            .selectAll("line.link")
            .data(edges)
            .enter()
            .append("line")
            .attr("class", "link")
            .style("opacity", .5)
            .style("stroke-width", "1.5px")
            .style("stroke", "#aaa")

            function updateGraph() {
                select(graph).selectAll("line.link")
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y)
            
                    select(graph).selectAll("circle")
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
            }

            function drag (simulation) {
  
                function dragstarted(d) {
                  if (!event.active) simulation.alphaTarget(0.3).restart();
                  d.fx = d.x;
                  d.fy = d.y;
                }
                
                function dragged(d) {
                  d.fx = event.x;
                  d.fy = event.y;
                }
                
                function dragended(d) {
                  if (!event.active) simulation.alphaTarget(0);
                  d.fx = null;
                  d.fy = null;
                }
                
                return drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended);
              }
        
    }

    render() {
        return <svg ref={graph => this.graph = graph} width={500} height={500}>
        </svg>
    }
}

export default GraphComponent