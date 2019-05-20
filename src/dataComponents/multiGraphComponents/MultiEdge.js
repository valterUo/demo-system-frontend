import React, { Component } from 'react'
import { select } from 'd3-selection'
//import store from '../../store'

const enterLink = (selection) => {

    selection.select('path')
        .attr('stroke-width', 1)
        .style('stroke', 'grey')
        //.style('opacity', '.5')
        .attr("fill", "none")
        .attr("marker-end", "url(#triangle)")

    selection.select('text')
        //.attr('dy', '.35em')
        .style('transform', 'translateX(-50%,-50%')
        .attr("text-anchor", "middle")
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
    }

    handleMouseEntering = () => {

    }

    handleMouseExiting = () => {
        
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
                <g ref={this.edgeRef} className={this.props.linkName} onMouseEnter={() => this.handleMouseEntering} onMouseLeave={() => this.handleMouseExiting}>
                    <path onClick={this.handle.bind(this)} />
                    <text>{this.props.data.name}</text>
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