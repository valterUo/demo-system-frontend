import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import MultiGraph from '../../dataComponents/multiGraphComponents/MultiGraph'
import Graph from '../../dataComponents/graphComponents/Graph'
import Button from 'react-bootstrap/Button'
import data from './data.json'


class CategoricalViewOfQuery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            graphData: undefined,
            morphisms: [{name: "knows", domain: "Graph customer", target: "Boolean"}, {name: "customerId", domain:"Customer", target: "Int"}, {name:  "creditLimit", domain: "Customer", target: "Int"}, {name: "customerName", domain: "Customer", target: "String"}, {name: "productPrice", domain: "Product", target: "Int"}, {name: "productId", domain: "Product", target: "String"}, {name: "productName", domain: "Product", target: "String"},
                {name: "orderNumber", domain: "Order", target: "String"}, {name: "ordered", domain: "Order", target: "Customer"}, {name: "contains", domain: "Tree Orders", target: "Boolean"}, {name: "address", domain: "Location", target: "String"}, {name: "cityName", domain: "Location", target: "String"}, {name: "countryName", domain: "Location", target: "String"}, {name: "locationId", domain: "Location", target: "Int"}, 
                {name: "zipCode", domain: "Location", target: "Int"}, {name: "located", domain: "Customer", target: "Location"}]
        }
    }

    parseQueryBlock = (query) => {
        let newQuery = query.split("QUERY (").join("@").split("QUERY(").join("@")
            .split(")\n").join("@").split(") FROM").join("@")
            .split("FROM").join("@")
            .split("AS").join("@")
            .split("TO").join("@")
            .split("RETURN").join("@").split("@")
            console.log(newQuery)
            return this.parseLambda(newQuery[1], newQuery[4].trim() + " " + newQuery[3].trim(), newQuery[5].trim() + " " + newQuery[3].trim())
    }

    parseLambda = (lambda, domain, target) => {
        let lambdaf = lambda
        if(lambda.includes("->")) {
            let f = lambda.split("->")
            lambdaf = f[1].trim()
            console.log(lambdaf)
        }

        if(lambdaf.startsWith("if")) {
            let answer = this.parseIf(lambdaf, domain, target)
            console.log(answer)
            return answer
        } else if (lambdaf.startsWith("case")) {

        } else if (lambdaf.includes("==")) {
            let answer = this.parseBooleanFunction(lambdaf, domain, target, "==")
            console.log(answer)
            return answer
        } else if (lambdaf.includes("<")) {
            let answer = this.parseBooleanFunction(lambdaf, domain, target, "<")
            console.log(answer)
            return answer
        } else if (lambdaf.includes(">")) {
            let answer = this.parseBooleanFunction(lambdaf, domain, target, ">")
            console.log(answer)
            return answer
        } else {
            return {domain: domain, outerFunction: "indentity", target: domain}
        }
    }

    parseIf = (lambda, domain, target) => {
        let parsedLambda = lambda.split("if").join("@").split("then").join("@").split("else").join("@").split("@")
        console.log(parsedLambda)
        return {domain: domain, outerFunction: lambda, target: target, innerFunction: this.parseLambda(parsedLambda[1], domain, target)}
    }

    parseBooleanFunction = (lambda, domain, target, operator) => {
        let parsedLambda = lambda.split(operator)
        console.log(parsedLambda)
        let foundMorphism
        let morphismsTarget
        this.state.morphisms.map(morphism => {
            if(parsedLambda[0].trim().includes(morphism.name)) {
                foundMorphism = parsedLambda[0].trim()
                morphismsTarget = morphism.target
            } else if (parsedLambda[1].trim().includes(morphism.name)) {
                foundMorphism = parsedLambda[1].trim()
                morphismsTarget = morphism.target
            }
            return morphism
    })
        return {domain: morphismsTarget, outerFunction: lambda, target: "Boolean", innerFunction: {domain: domain, outerFunction: foundMorphism, target: morphismsTarget, innerFunction: this.parseLambda(foundMorphism, morphismsTarget, target)}}
    }

    compositionTreeToGraph = (graph, composition) => {
        //console.log(graph)
        let sourceIndex
        let targetIndex
        const domainElement = {name: composition.domain}
        const targetElement = {name: composition.target}
        graph.nodes.map((node, i) => {
            if(JSON.stringify(node) === JSON.stringify(domainElement)) {
                sourceIndex = i
            } else if (JSON.stringify(node) === JSON.stringify(targetElement)) {
                targetIndex = i
            }
            return node
        })
        if(sourceIndex === undefined) {
            sourceIndex = graph.nodes.push(domainElement) - 1
        }
        if(targetIndex === undefined) {
            targetIndex = graph.nodes.push(targetElement) - 1
        }
        graph.links.push({source: sourceIndex, target: targetIndex, name: composition.outerFunction})
        if(composition.innerFunction !== undefined) {
            this.compositionTreeToGraph(graph, composition.innerFunction)
        } else {
            console.log(graph)
            let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now()
            this.setState({graphData: graph, graphKey: timeStampInMs})
        }
    }

    loadStuff = (event) => {
        event.preventDefault()
        if(this.props.query !== "") {
            this.compositionTreeToGraph({nodes: [], links: []}, this.parseQueryBlock(this.props.query))
        }
    }

    render() {
        console.log(this.parseQueryBlock(this.props.query))
        if (this.state.graphData === undefined) {
            return <Button onClick = {this.loadStuff.bind(this)}/>
        } else {
            return <Container style={{ margin: "5px" }} fluid="true">
                <MultiGraph key={this.state.graphKey} data={this.state.graphData} width={this.props.width} height={this.props.height} nodeName={'ViewOfQueryNodes'} linkName={'ViewOfQueryLinks'} nameClass={'ViewOfQueryClassName'} editableGraph={false} />
            </Container>
        }
    }
}

export default CategoricalViewOfQuery