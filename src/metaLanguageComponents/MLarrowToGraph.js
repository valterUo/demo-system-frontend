import React, { Component } from 'react'
import MultiGraph from '../dataComponents/multiGraphComponents/MultiGraph'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class MLarrowToGraph extends Component {
    constructor(props) {
        super(props)
        this.state = { source: "", target: "", data: { nodes: [], links: [] }, show: false }
    }

    handleSourceChange = (event) => {
        this.setState({
            source: event.target.value
        })
    }

    handleTargetChange = (event) => {
        this.setState({
            target: event.target.value
        })
    }

    countLinks(links) {
        links.map(linkObject => {
            links.map(linkObject2 => {
                if (JSON.stringify(linkObject) !== JSON.stringify(linkObject2)) {
                    if ((linkObject.source === linkObject2.source && linkObject.target === linkObject2.target) || (linkObject.target === linkObject2.source && linkObject.source === linkObject2.target)) {
                        linkObject2.count = linkObject2.count + 1
                    }
                }
                return linkObject2
            })
            return linkObject
        })
        return links
    }

    initializeCode(text) {
        return text.split(";")
            .join("")
            .split("\n")
            .join("")
            .split("|")
            .map(element => element.trim())
            .map(pair => pair.split("=>").map(element => element.trim()))
    }

    constructLinks(nodes, sourceLinks, targetLinks) {
        let links = sourceLinks.map(link => {
            let linkPairIndex = { name: link[0], source: "", target: "", count: 1 }
            nodes.map((node, i) => {
                if (node.name === link[1]) {
                    linkPairIndex.source = i
                }
                return node
            })
            return linkPairIndex
        })
        links.map(linkObject => {
            targetLinks.map(targetLink => {
                if (targetLink[0] === linkObject.name) {
                    nodes.map(node => {
                        if (node.name === targetLink[1]) {
                            linkObject.target = node.id
                        }
                        return node
                    })
                }
                return targetLink
            })
            return linkObject
        })
        return links
    }

    constructNodesAndLinks() {
        let sourceLinks = this.initializeCode(this.state.source)
        let targetLinks = this.initializeCode(this.state.target)
        let nodesSet = new Set([])
        sourceLinks.map(pair => nodesSet.add(pair[1]))
        targetLinks.map(pair => nodesSet.add(pair[1]))
        let nodes = [...nodesSet].map((element, i) => { return { name: element, id: i } })
        let links = this.constructLinks(nodes, sourceLinks, targetLinks)
        links = this.countLinks(links)
        return { nodes: nodes, links: links }
    }

    handleCodeSubmit = (event) => {
        event.preventDefault()
        if (this.state.show === true) {
            this.setState({ show: false })
        }
        let data = this.constructNodesAndLinks()

        this.setState({
            source: "",
            target: ""
        })
        this.setState({
            data: { "nodes": data.nodes, "links": data.links }
        }, () => { this.setState({ show: true }) })
    }

    render() {
        return <div>
            <Form onSubmit={this.handleCodeSubmit}>
                <Form.Group controlId="MLsource">
                    <Form.Label>Enter ML definition of source function</Form.Label>
                    <Form.Control as="textarea" rows="5" value={this.state.source} onChange={this.handleSourceChange} />
                </Form.Group>
                <Form.Group controlId="MLtarget">
                    <Form.Label>Enter ML definition of target function</Form.Label>
                    <Form.Control as="textarea" rows="5" value={this.state.target} onChange={this.handleTargetChange} />
                </Form.Group>
                <Button type="submit" variant="dark">Construct graph</Button>
            </Form>
            {(this.state.show === true) &&
                <MultiGraph key={"MLcategory"} id="100" data={this.state.data} width={1500} height={1500} nodeName={"MLnodes"} linkName={"MLlinks"} nameClass={"MLGraph"} />}
        </div>
    }
}

export default MLarrowToGraph