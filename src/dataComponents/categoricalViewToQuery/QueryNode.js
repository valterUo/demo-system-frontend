import React, { Component } from 'react'
import { select } from 'd3-selection'
import { scaleOrdinal } from 'd3-scale'
import { transition } from 'd3-transition' // eslint-disable-line
import { schemeCategory10 } from 'd3-scale-chromatic'
import store from '../../store'
const color = scaleOrdinal(schemeCategory10)

class QueryNode extends Component {
    constructor(props) {
        super(props)
        this.nodeRef = React.createRef()
    }

    componentDidMount() {
        this.d3Node = select(this.nodeRef.current)
            .datum(this.props.data)
            .call(this.enterNode)
    }

    componentDidUpdate() {
        this.d3Node
            .datum(this.props.data)
            .call(this.updateNode)
    }

    updateNode(selection) {
        selection.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
    }

    enterNode(selection) {
        let r = 10
        if(selection.select('text').text().includes("fold")) {
            r = 13
        }
        selection.select('circle')
            .attr('r', r)
            .style('fill', function (d) {
                let firstAttribute = Object.keys(d)[0]
                return color(d[firstAttribute])
            })
            .style('stroke', 'black')
            .style('stroke-width', '1')
    
        selection.select('text')
            .attr('dy', '.4em')
            .attr('dx', '.8em')
            .style('transform', 'translateX(-50%,-50%')
    
    }

    handleOnMouseEnter(e) {
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
            store.dispatch({ type: 'SHOW_NODE_EDGE_DATA', data: filteredData, header: "Node" })
        }
        this.d3Node.select("circle").style("fill", "#FCBC34")
    }

    handleColorChangeBack(e) {
        this.d3Node.select('circle').style('fill', function (d) {
            let firstAttribute = Object.keys(d)[0]
            return color(d[firstAttribute])
        })
    }

    expandLambdaFunction(e) {
        console.log(this.props.data.id)
        this.props.handleDataChange(this.props.data.id)
    }

    render() {
        return (
            <g ref={this.nodeRef} className={this.props.nodeName}>
                <circle onMouseEnter={this.handleOnMouseEnter.bind(this)} onMouseLeave={this.handleColorChangeBack.bind(this)} onClick={this.expandLambdaFunction.bind(this)} />
                <text>{this.props.data.name}</text>
            </g>
        )
    }
}

export default QueryNode