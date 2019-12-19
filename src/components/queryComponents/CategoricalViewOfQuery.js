import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import MultiGraph from '../../dataComponents/multiGraphComponents/MultiGraph'
import morphisms from './morphismsForCategoricalView'

class CategoricalViewOfQuery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            graphData: undefined, morphisms: morphisms.morphisms.simpleDemo.morphisms
        }
        this.splitted = React.createRef()
    }

    componentDidMount() {
        if (this.props.query !== "") {
            let graph = this.parseLetBeInBlock(this.props.query)
            let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now()
            this.setState({ graphData: graph, graphKey: timeStampInMs })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.query !== this.props.query) {
            if (this.props.query !== "") {
                let graph = this.parseLetBeInBlock(this.props.query)
                let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now()
                this.setState({ graphData: graph, graphKey: timeStampInMs })
            }
        }

        if (prevProps.dataSet.nameForCategoricalQueryView !== this.props.dataSet.nameForCategoricalQueryView) {
            this.setState({ morphisms: morphisms.morphisms[this.props.dataSet.nameForCategoricalQueryView].morphisms })
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
            return this.compositionTreeToGraphWithoutDuplicateNodes({ nodes: [], links: [] }, element)
        })
        let totalGraph = { nodes: [], links: [] }
        newBlocks.map(graph => {
            totalGraph = this.compositionGraphsWithDuplicateNodes(totalGraph, graph)
            return graph
        })
        //console.log(totalGraph)
        return totalGraph
    }


    parseQueryBlock = (query) => {
        this.splitted = false
        let newQuery = query.split("QUERY (").join("@").split("QUERY(").join("@")
            .split(")\n").join("@").split(") FROM").join("@")
            .split("FROM").join("@")
            .split("AS").join("@")
            .split("TO").join("@").split("@")
        //console.log(newQuery)
        return this.parseLambda(newQuery[1], newQuery[4].trim() + " " + newQuery[3].trim(), "all " + newQuery[3].trim())
    }

    parseLambda = (lambdaf, domain, target) => {
        console.log(lambdaf)
        try {
            if (lambdaf.includes("->") && !(this.splitted)) {
                lambdaf = lambdaf.split(/->(.+)/)[1].trim()
                this.splitted = true
                return { domain: target, outerFunction: "-", innerFunction: this.parseLambda(lambdaf, target.split(" ")[1], domain) }
            }
            if (lambdaf.startsWith("if")) {
                return this.parseIf(lambdaf, domain, target)
            } else if (lambdaf.startsWith("case")) {
                let g = lambdaf.split(/->(.+)/).join("@").split(";").join("@").split("@")
                this.parseLambda(g[1].trim(), domain, target)
            } else if (lambdaf.includes(":")) {
                lambdaf = lambdaf.split(":")[0].trim()
                return { domain: target, outerFunction: "cons function :", innerFunction: this.parseLambda(lambdaf, target.split(" ")[1], domain) }
            } else if (lambdaf.includes("==")) {
                return this.parseBooleanFunction(lambdaf, domain, target, "==")
            } else if (lambdaf.includes("<")) {
                return this.parseBooleanFunction(lambdaf, domain, target, "<")
            } else if (lambdaf.includes(">")) {
                return this.parseBooleanFunction(lambdaf, domain, target, ">")
            } //else if (lambdaf.startsWith("(")) {
            //     return this.parseTermsOfTuple(lambdaf, domain, target)
            else {
                if(target.split(" ")[1] === undefined) {
                    return { domain: "collection", outerFunction: lambdaf.trim(), target: target }
                } else {
                    console.log(target, target.split(" ")[1])
                    return { domain: target.split(" ")[1], outerFunction: lambdaf.trim(), target: target }
                }
            }
        } catch (error) {
            console.log(error)
        }

    }

    parseTermsOfTuple = (lambdaf, domain, target) => {
        let termsOfTuple = lambdaf.split(",")//.map(term => term.split(/([()])/))
        termsOfTuple = termsOfTuple.map(term => {
            if (term[0] === "(") {
                return term.substr(1).trim()
            } else if (term[term.length - 1] === ")") {
                return term.substr(0, term.length - 1).trim()
            }
            return term.trim()
        })
        console.log(termsOfTuple)
        return { domain: "Tuple", outerFunction: lambdaf.trim(), innerFunction: termsOfTuple.map(term => this.parseLambda(term, domain, target)) }
    }

    parseIf = (lambda, domain, target) => {
        let parsedLambda = lambda.split("if").join("@").split("then").join("@").split("else").join("@").split("@")
        return { domain: "Boolean", outerFunction: lambda.trim(), innerFunction: this.parseLambda(parsedLambda[1], domain, target) }
    }

    parseBooleanFunction = (lambda, domain, target, operator) => {
        let parsedLambda = lambda.split(operator)
        let foundMorphism, morphismsTarget
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
        graph1.links = graph1.links.concat(graph2.links.map((link, i) => {
            link.id = graph1.links.length + i
            return link
        }))
        //console.log(graph1)
        return graph1
    }

    compositionTreeToGraphWithoutDuplicateNodes = (graph, composition) => {
        console.log(composition)
        let domainElement
        let targetElement = { name: composition.domain, id: graph.nodes.length }
        if(Array.isArray(composition.innerFunction)) {
            let outerFunctionsNames = composition.innerFunction.map(f => f.outerFunction)
            domainElement = composition.innerFunction.map((element, i) => { return { name: element.domain, id: graph.nodes.length + i + 1 }})
            domainElement.map((node, i) => this.addEdgeToGraph(graph, node, targetElement, outerFunctionsNames[i]))
        } else if (composition.innerFunction !== undefined) {
            domainElement = { name: composition.innerFunction.domain, id: graph.nodes.length + 1 }
            if(composition.innerFunction === undefined) {
                this.addEdgeToGraph(graph, domainElement, targetElement, undefined)
            } else {
                this.addEdgeToGraph(graph, domainElement, targetElement, composition.innerFunction.outerFunction)
            }   
        } else {
            domainElement = { name: composition.target, id: graph.nodes.length + 1 }
            if(composition.innerFunction === undefined) {
                this.addEdgeToGraph(graph, domainElement, targetElement, undefined)
            } else {
                this.addEdgeToGraph(graph, domainElement, targetElement, composition.innerFunction.outerFunction)
            } 
        }
        if (composition.innerFunction !== undefined) {
            graph = this.compositionTreeToGraphWithoutDuplicateNodes(graph, composition.innerFunction)
        }
        console.log(graph)
        return graph
    }

    addEdgeToGraph = (graph, domain, target, functionName) => {
        let sourceIndex, targetIndex
        graph.nodes.map((node, i) => {
            if (node.name === domain.name) {
                sourceIndex = i
            }
            if (node.name === target.name) {
                targetIndex = i
            }
            return node
        })
        if (sourceIndex === undefined) {
            sourceIndex = graph.nodes.push(domain) - 1
        }
        if (targetIndex === undefined) {
            targetIndex = graph.nodes.push(target) - 1
        }
        if (functionName === undefined) {
            functionName = "type constructor " + domain.name
        }
        graph.links.push({ source: sourceIndex, target: targetIndex, name: functionName, count: 1, id: graph.links.length })
        return graph
    }

    render() {
        if (this.state.graphData === undefined) {
            return null
        } else {
            return <Container style={{ margin: "5px" }} fluid="true">
                <MultiGraph key={this.state.graphKey} data={this.state.graphData} width={this.props.width} height={this.props.height}
                    nodeName={'ViewOfQueryNodes'} linkName={'ViewOfQueryLinks'} nameClass={'ViewOfQueryClassName'} editableGraph={false} showEdgeLabels={false} />
            </Container>
        }
    }
}

export default CategoricalViewOfQuery