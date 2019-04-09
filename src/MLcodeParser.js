/* eslint-disable no-loop-func */

const countLinks = (links) => {
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

const initializeCode = (text) => {
    return text.split(";")
        .join("")
        .split("\n")
        .join("")
        .split("|")
        .map(element => element.trim())
        .map(pair => pair.split("=>").map(element => element.trim()))
}

const constructLinks = (nodes, sourceLinks, targetLinks) => {
    let links = sourceLinks.map(link => {
        let linkPairIndex = {
            name: link[0],
            source: "",
            target: "",
            count: 1
        }
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

const constructNodesAndLinks = (source, target) => {
    let sourceLinks = initializeCode(source)
    let targetLinks = initializeCode(target)
    let nodesSet = new Set([])
    sourceLinks.map(pair => nodesSet.add(pair[1]))
    targetLinks.map(pair => nodesSet.add(pair[1]))
    let nodes = [...nodesSet].map((element, i) => {
        return {
            name: element,
            id: i
        }
    })
    let links = constructLinks(nodes, sourceLinks, targetLinks)
    links = countLinks(links)
    return {
        nodes: nodes,
        links: links
    }
}

const parse = (source, target) => {
    const data = constructNodesAndLinks(source, target)
    const categoricalData = []
    let i = 0
    while (true) {
        const filteredLinks = data.links.filter(link => {
            const count = (link.name.match(/_/g) || []).length
            if (count === i) {
                return link
            }
        })
        if (filteredLinks.length === 0) {
            break
        } else {
            const nodes = JSON.parse(JSON.stringify(data.nodes))
            categoricalData.push({ data: {
                nodes: nodes,
                links: filteredLinks },
                id: i
            })
            i++
        }
    }
    console.log(categoricalData)
    return categoricalData
}

export default {
    parse,
    constructNodesAndLinks
}