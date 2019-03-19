import React, { Component } from 'react'
import { select } from 'd3-selection'
//import store from '../../store'

const enterLink = (selection) => {

    selection.select('path')
        .attr('stroke-width', 3)
        .style('stroke', 'black')
        .style('opacity', '.1')
        .attr("fill", "none")
        .attr("marker-end", "url(#triangle)")

    selection.select('text')
        .attr('dy', '.35em')
        .style('transform', 'translateX(-50%,-50%')
        .attr("text-anchor", "middle")
}

const updateLink = (selection) => {
    selection.attr("d", function (d) {
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

        let drx = dr,
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
}

class MultiEdge extends Component {
    constructor(props) {
        super(props);
        this.edgeRef = React.createRef()
    }

    componentDidMount() {
        this.d3Link = select(this.edgeRef.current)
            .datum(this.props.data)
            .call(enterLink)
    }

    componentDidUpdate() {
        this.d3Link.datum(this.props.data)
            .call(updateLink)
    }

    handle(e) {
        console.log(this.props + ' been clicked')
        /*let jsonData = this.props.data
        let filteredData = []
        for (const key in jsonData) {
            if (key !== "index") {
                const val = jsonData[key]
                filteredData.push({"key": key, "value": val})
            }
            else {
                break
            }
        }
        store.dispatch({ type: 'ADD_DATA', data: filteredData })*/
    }

    render() {
        if (this.props.data.name !== undefined) {
            return (
                <g ref={this.edgeRef} className={this.props.linkName}>
                    <path onClick={this.handle.bind(this)} />
                    <text>{this.props.data.name}</text>
                </g>
            )
        }
        else {
            return (
                <g ref={this.edgeRef} className={this.props.linkName}>
                    <path onClick={this.handle.bind(this)} />
                </g>
            )
        }
    }
}

export default MultiEdge