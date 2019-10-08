import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import MultiGraph from '../../dataComponents/multiGraphComponents/MultiGraph'


class CategoricalViewOfQuery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            graphData: undefined
        }
    }

    parseQueryBlock = (query) => {
        let newQuery = query.split("(").join("@")
            .split(")").join("@")
            .split("FROM").join("@")
            .split("AS").join("@")
            .split("TO").join("@").split("@")
            console.log(newQuery)
    }

    parseIF = (lambda, domain, target) => {
        let parsedLambda = lambda.split("if").join("@").split("then").join("@").split("else").join("@").split("@")
        return {totalFunction: lambda, domain: domain, target: target, innerFunction: {totalFunction: parsedLambda[1], target: "boolean"}}
    }

    render() {
        this.parseQueryBlock(this.props.query)
        if (this.state.graphData === undefined) {
            return null
        } else {
            return <Container style={{ margin: "5px" }} fluid="true">
                <MultiGraph key={this.props.graphKey} data={this.props.graphResult} width={this.props.width} height={this.props.height} nodeName={'ViewOfQueryNodes'} linkName={'ViewOfQueryLinks'} />
            </Container>
        }
    }
}

export default CategoricalViewOfQuery