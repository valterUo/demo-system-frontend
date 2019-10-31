import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import MultiGraph from '../../dataComponents/multiGraphComponents/MultiGraph'

class CategoricalViewOfQuery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            graphData: undefined,
            morphisms: [{ name: "knows", domain: "Graph customers", target: "Boolean" }, { name: "customerId", domain: "Customer", target: "Int" }, { name: "creditLimit", domain: "Customer", target: "Int" }, { name: "customerName", domain: "Customer", target: "String" }, { name: "productPrice", domain: "Product", target: "Int" }, { name: "productId", domain: "Product", target: "String" }, { name: "productName", domain: "Product", target: "String" },
            { name: "orderNumber", domain: "Order", target: "String" }, { name: "ordered", domain: "Order", target: "Customer" }, { name: "contains", domain: "XML Orders", target: "Boolean" }, { name: "address", domain: "Location", target: "String" }, { name: "cityName", domain: "Location", target: "String" }, { name: "countryName", domain: "Location", target: "String" }, { name: "locationId", domain: "Location", target: "Int" },
            { name: "zipCode", domain: "Location", target: "Int" }, { name: "located", domain: "Customer", target: "Location" }, { name: "cons Graph", domain: "Customer", target: "Graph customers" },
            { name: "cons Location", domain: "Location", target: "Relational locations" }, { name: "cons Order", domain: "Order", target: "XML orders" }]
        }
        this.splitted = React.createRef()
    }

    componentDidMount() {
        if (this.props.query !== "" && !this.props.query.includes("patent")) {
            let graph = this.parseLetBeInBlock(this.props.query)
            let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now()
            this.setState({ graphData: graph, graphKey: timeStampInMs })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.query !== this.props.query) {
            if (this.props.query !== "" && !this.props.query.includes("patent")) {
                let graph = this.parseLetBeInBlock(this.props.query)
                let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now()
                this.setState({ graphData: graph, graphKey: timeStampInMs })
            }
        }
    }

    parseLetBeInBlock = (query) => {
        let newQuery = query.split("BE").join("@").split("IN").join("@").split("@")
        let blocks = []
        newQuery.map(query => {
            if (query.includes("QUERY")) {
                blocks.push(this.parseQueryBlock(query))
            }
            return query
        })
        let newBlocks = blocks.map(element => {
            console.log(element)
            return this.compositionTreeToGraphWithoutDuplicateNodes({ nodes: [], links: [] }, element)
        })
        console.log(newBlocks)
        let totalGraph = { nodes: [], links: [] }
        newBlocks.map(graph => {
            totalGraph = this.compositionGraphsWithDuplicateNodes(totalGraph, graph)
            return graph
        })
        console.log(totalGraph)
        return totalGraph
    }


    parseQueryBlock = (query) => {
        this.splitted = false
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
        try {
            if (lambda.includes("->") && !(this.splitted)) {
                const re = /->(.+)/
                let f = lambda.split(re)
                console.log(f)
                lambdaf = f[1].trim()
                this.splitted = true
                return { domain: target, outerFunction: "-", innerFunction: this.parseLambda(lambdaf, target.split(" ")[1], domain) }
            }
            console.log(lambdaf)
            if (lambdaf.startsWith("if")) {
                let answer = this.parseIf(lambdaf, domain, target)
                return answer
            } else if (lambdaf.startsWith("case")) {
                console.log(lambdaf)
                let g = lambdaf.split(/->(.+)/).join("@").split(";").join("@").split("@")
                console.log(g)
                this.parseLambda(g[1].trim(), domain, target)
            } else if (lambdaf.includes("==")) {
                let answer = this.parseBooleanFunction(lambdaf, domain, target, "==")
                return answer
            } else if (lambdaf.includes("<")) {
                let answer = this.parseBooleanFunction(lambdaf, domain, target, "<")
                return answer
            } else if (lambdaf.includes(">")) {
                let answer = this.parseBooleanFunction(lambdaf, domain, target, ">")
                return answer
            } else {
                return { domain: target.split(" ")[1], outerFunction: lambda.trim(), target: target }
            }

        } catch (error) {
            console.log(error)
        }

    }

    parseIf = (lambda, domain, target) => {
        let parsedLambda = lambda.split("if").join("@").split("then").join("@").split("else").join("@").split("@")
        return { domain: "Boolean", outerFunction: lambda.trim(), innerFunction: this.parseLambda(parsedLambda[1], domain, target) }
    }

    parseBooleanFunction = (lambda, domain, target, operator) => {
        let parsedLambda = lambda.split(operator)
        console.log(parsedLambda)
        let foundMorphism
        let morphismsTarget
        this.state.morphisms.map(morphism => {
            if (parsedLambda[0].trim().includes(morphism.name)) {
                foundMorphism = parsedLambda[0].trim()
                morphismsTarget = morphism.target
            } else if (parsedLambda[1].trim().includes(morphism.name)) {
                foundMorphism = parsedLambda[1].trim()
                morphismsTarget = morphism.target
            }
            return morphism
        })
        console.log(foundMorphism)
        return { domain: morphismsTarget, outerFunction: lambda.trim(), innerFunction: this.parseLambda(foundMorphism, morphismsTarget, target) }
    }

    compositionGraphsWithDuplicateNodes = (graph1, graph2) => {
        graph2.nodes.map((node, i) => {
            node.id = graph1.nodes.length + 1
            let newIndex = graph1.nodes.push(node) - 1
            graph2.links = graph2.links.map(link => {
                let newLink = link
                if (link.source === i) {
                    newLink.source = newIndex
                }
                if (link.target === i) {
                    newLink.target = newIndex
                }
                return newLink
            })
            return node
        })
        console.log(graph2.links)
        graph1.links = graph1.links.concat(graph2.links.map((link, i) => {
            link.id = graph1.links.length + i
            return link
        }))
        console.log(graph1)
        return graph1
    }

    compositionTreeToGraphWithoutDuplicateNodes = (graph, composition) => {
        let sourceIndex
        let targetIndex
        let domainElement
        let targetElement = { name: composition.domain, id: graph.nodes.length }
        if (composition.innerFunction !== undefined) {
            domainElement = { name: composition.innerFunction.domain, id: graph.nodes.length + 1 }
        } else {
            domainElement = { name: composition.target, id: graph.nodes.length + 1 }
        }

        graph.nodes.map((node, i) => {
            if (node.name === domainElement.name) {
                sourceIndex = i
            }
            if (node.name === targetElement.name) {
                targetIndex = i
            }
            return node
        })
        if (sourceIndex === undefined) {
            sourceIndex = graph.nodes.push(domainElement) - 1
        }
        if (targetIndex === undefined) {
            targetIndex = graph.nodes.push(targetElement) - 1
        }
        let functionName
        if (composition.innerFunction !== undefined) {
            functionName = composition.innerFunction.outerFunction.trim()
        } else {
            functionName = "type constructor " + domainElement.name
        }
        graph.links.push({ source: sourceIndex, target: targetIndex, name: functionName, count: 1, id: graph.links.length })
        if (composition.innerFunction !== undefined) {
            graph = this.compositionTreeToGraphWithoutDuplicateNodes(graph, composition.innerFunction)
        }
        return graph
    }

    render() {
        //console.log(this.parseQueryBlock(this.props.query))
        if (this.state.graphData === undefined) {
            return null
        } else {
            return <Container style={{ margin: "5px" }} fluid="true">
                <MultiGraph key={this.state.graphKey} data={this.state.graphData} width={this.props.width} height={this.props.height} nodeName={'ViewOfQueryNodes'} linkName={'ViewOfQueryLinks'} nameClass={'ViewOfQueryClassName'} editableGraph={false} />
            </Container>
        }
    }
}

export default CategoricalViewOfQuery