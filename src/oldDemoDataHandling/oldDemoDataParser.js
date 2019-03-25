import React, { Component } from 'react'
import dataService from '../services/dataService'

const loadData = async (type, store) => {
    const data = await dataService.getData(type)
    console.log(data)
    const tables = data.data.tables.map((table, i) => {
        const obj = { title: table.name, eventKey: i, data: [table.attributes] }
        table.rows.map(d => obj.data.push(d.row))
        return obj
    })

    const rawTree = JSON.parse(data.data.tree)
    const tree = { nodes: [], links: [] }
    walkTree(rawTree, tree.nodes, tree.links)
    console.log(tree)

    store.dispatch({ type: 'ADD_DATA', sqlData: tables, documentData: tree, graphData: data.data.graph})
}

const walkTree = (tree, nodes, links) => {
    nodes.push({"name": tree.userObject, "id": tree.id})
    if (tree.children !== undefined) {
        tree.children.map(c => links.push({"source": tree.id, "target": c.id}))
        tree.children.map(c => walkTree(c, nodes, links))
    }
}

class DemoDataParser extends Component {
    constructor(props) {
        super(props)
        this.state = { sqlData: undefined, documentData: undefined, graphData: undefined }
    }

    loadData = async (type) => {
        const data = await dataService.getData(type)
        console.log(data)
    }
}

export default { loadData }