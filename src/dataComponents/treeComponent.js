import React, { Component } from 'react'
import { select } from 'd3-selection'
import * as d3 from 'd3'

class TreeComponent extends Component {
    constructor(props) {
        super(props)
        this.createTreeComponent = this.createTreeComponent.bind(this)
    }

    componentDidMount() {
        this.createTreeComponent()
    }

    componentDidUpdate() {
        this.createTreeComponent()
    }

    createTreeComponent() {
        const tree = this.tree
        const root = this.props.data.root

    }

    render() {
        return <svg ref={tree => this.tree = tree} width={500} height={500}>
        </svg>
    }
}
export default TreeComponent