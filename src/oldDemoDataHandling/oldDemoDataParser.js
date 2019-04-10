import dataService from '../services/dataService'

const loadData = async (type) => {
    //Table:
    const data = await dataService.getData(type)
    const tables = data.data.tables.map((table, i) => {
        const obj = { title: table.name, eventKey: i, data: [table.attributes] }
        table.rows.map(d => obj.data.push(d.row))
        return obj
    })

    //Tree:
    const rawTree = JSON.parse(data.data.tree)
    const tree = { nodes: [], links: [] }
    const tempLinks = []
    walkTree(rawTree, tree.nodes, tempLinks)
    constructLinks(tree.nodes, tempLinks, tree.links)

    //Graph::
    const graph = { nodes: [], links: [] }
    data.data.graph.nodes.map(o => {
        const newObj = o.dataAndAttributes
        newObj['id'] = o.id
        return graph.nodes.push(newObj)
    })
    constructLinks(graph.nodes, data.data.graph.links, graph.links)
    console.log(tree)
    return { sqlData: tables, documentData: tree, graphData: graph }
}

const walkTree = (tree, nodes, links) => {
    nodes.push({ "name": tree.userObject, "id": tree.id })
    if (tree.children !== undefined) {
        tree.children.map(c => links.push({"source": tree.id, "target": c.id}))
        tree.children.map(c => walkTree(c, nodes, links))
    }
}

const constructLinks = (nodes, links, newLinks) => {
    links.map(link => {
        let sourceObjectIndex = undefined
        let targetObjectIndex = undefined
        nodes.map((node, i) => {
            if (node.id === link.source) {
                sourceObjectIndex = i
            }
            return node
        })

        nodes.map((node, i) => {
            if (node.id === link.target) {
                targetObjectIndex = i
            }
            return node
        })
        return newLinks.push({ "source": sourceObjectIndex, "target": targetObjectIndex })
    })
}

export default { loadData }