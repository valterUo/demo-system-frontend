import React, { Component } from 'react'
import { select } from 'd3-selection'
//import store from '../../store'

const enterLink = (selection) => {

    selection.select('line')
        .attr('stroke-width', 3)
        .style('stroke', 'black')
        .style('opacity', '.1')
        .attr("marker-end", "url(#triangle)")

        selection.select('text')
        .attr('dy', '.35em')
        .style('transform', 'translateX(-50%,-50%')
        .attr("text-anchor", "middle")
}

const updateLink = (selection) => {
    selection
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)
}

class Edge extends Component {
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
        if(this.props.data.name !== undefined) {
        return (
            <g ref={this.edgeRef} className={this.props.linkName}>
                <line onClick={this.handle.bind(this)} />
                <text>{this.props.data.name}</text>
            </g>
        ) }
        else {
            return(
                <g ref={this.edgeRef} className={this.props.linkName}>
                <line onClick={this.handle.bind(this)} />
                </g>
            )
        }
    }
}

export default Edge