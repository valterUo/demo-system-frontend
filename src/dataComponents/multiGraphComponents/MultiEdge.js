import React, { Component } from 'react'
import { select } from 'd3-selection'

class MultiEdge extends Component {
    constructor(props) {
        super(props)
        this.edgeRef = React.createRef()
    }

    componentDidMount() {
        this.d3Link = select(this.edgeRef.current)
            .datum(this.props.data)
            .call(this.enterLink)
    }

    componentDidUpdate() {
        this.d3Link.datum(this.props.data)
    }

    enterLink = (selection) => {
        selection.select('path')
            .attr('stroke-width', 2)
            .style('stroke', 'grey')
            .attr("fill", "none")
            .attr("marker-end", "url(#multitriangle" + this.props.linkName + ")")

        selection.select('text')
            .style('transform', 'translateX(-50%,-50%')
            .attr("text-anchor", "start")
    }

    wrapText = (text, width) => {
        let line = [], lineNumber = 1,
            lineHeight = -5, // pxs
            y = this.d3Link.select("textPath").attr("y"),
            dy = parseFloat(this.d3Link.select("text").attr("dy")),
            tspan = this.d3Link.select("textPath").text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "px")
        let words = text.split(" ").filter(word => {
            if(word !== "" || word !== "\n" || word !== " ") {
                console.log(word)
                return word.trim()
            }
            return word
        })
        while (words.length > 0) {
            let word = words.pop()
            //console.log(word)
            line.push(word)
            const printableLine = line.slice().reverse()
            //console.log(printableLine)
            tspan.text(printableLine.join(" "))
            //console.log(line)
            if (tspan.node().getComputedTextLength() > width) {
                line.pop()
                const printableLine = line.slice().reverse()
                console.log(printableLine)
                tspan.text(printableLine.join(" "))
                line = [word]
                //console.log(line)
                tspan = this.d3Link.select("textPath").append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "px")
            }
        }
    }

    handleMouseEntering = () => {
        this.d3Link.select("text")
            .attr("visibility", "visible")
        this.wrapText(this.props.data.name, 150)
        this.d3Link.select('path')
            .attr('stroke-width', 5)
            .style('stroke', '#666666')
            .attr("fill", "none")
    }

    handleMouseExiting = () => {
        this.d3Link.select("text")
            .attr("visibility", "hidden")
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
                    <text visibility="hidden"><textPath href={"#" + pathId} style={{ textAnchor: "start" }} ></textPath></text>
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