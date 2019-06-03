/* eslint-disable array-callback-return */
const queryAnswerParser = (inputString, schema, model) => {
    inputString = inputString.split(" ").join("")
    inputString = inputString.split("\n").join("")
    let nodes = [], links = []
    if (model === "graph") {
        inputString = inputString.split(/[()]/)
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
    } else if ( model === "tree") {
        inputString = inputString.split(/[{}]/)
        inputString = inputString.filter(element => {
            if (element !== "") {
                return element
            }
        })
        inputString = inputString.map(element => {
            element = element.split(/[(),]/)
            return element
        })
        inputString = inputString.map(element => {
            let cutTail = true
            element = element.filter(subelement => {
                if(cutTail) {
                    if(subelement === "") {
                        cutTail = false
                    } else {
                        return subelement
                    }
                }
            })
            return element
        })
        let rootIndex
        inputString.map(element => {
            for (let i = 0; i < element.length; i++) {
                if(i === 0) {
                    let root = {name: element[0], id: element[1]}
                    nodes.push(root)
                    rootIndex = nodes.length - 1
                    i += 1
                } else {
                    let newNode = {type: element[i], id: element[i+1], name: element[i+2]}
                    nodes.push(newNode)
                    let newLink = {source: rootIndex, target: nodes.length - 1}
                    links.push(newLink)
                    i += 2
                }
            }
            return element
        })
        return {
            nodes: nodes,
            links: links
        }
    }
}

export default {
    queryAnswerParser
}