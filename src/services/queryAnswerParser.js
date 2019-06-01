const queryAnswerParser = (inputString, schema, model) => {
    if (model === "graph") {
        inputString = inputString.split(" ").join("")
        inputString = inputString.split(/[()]/)
        let nodes = [], links = []
        inputString = inputString.filter(element => {
            if (element !== "" && element !== "\n") {
                return element
            }
        })
        inputString = inputString.map((element, i) => {
            if (i % 2 === 0) {
                if (i % 4 === 0 && i > 0) {
                    links.push({
                        source: nodes[nodes.length - 2],
                        target: nodes[nodes.length - 1]
                    })
                }
            } else {
                let newElement = element.split(",")
                let obj = {}
                schema.map((attr, j) => {
                    obj[attr] = newElement[j]
                    return attr
                })
                nodes.push(JSON.stringify(obj))
                return element
            }
        })
        let nodeSet = new Set(nodes)
        let nodeList = Array.from(nodeSet)
        links = links.map(link => {
            let newLink = {}
            nodeList.map((node, i) => {
                if (node === link.source) {
                    newLink["source"] = i
                }
                if (node === link.target) {
                    newLink["target"] = i
                }
                return node
            })
            return newLink
        })
        nodeList = nodeList.map(node => JSON.parse(node))
        return {
            nodes: nodeList,
            links: links
        }
    }
}

export default {
    queryAnswerParser
}