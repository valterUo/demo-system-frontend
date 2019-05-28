const queryAnswerParser = (inputString, schema) => {
    //let testString = "(customer (6,Mill,0) , customer (3,Daddy,200)) (customer (4,William,30) , customer (2,William,3000)) (customer (4,William,30) , customer (5,Erica,8000)) (customer (0,Mary,5000) , customer (5,Erica,8000)) (customer (1,John,2000) , customer (6,Mill,0)) (customer (1,John,2000) , customer (2,William,3000)) (customer (3,Daddy,200) , customer (6,Mill,0)) (customer (3,Daddy,200) , customer (1,John,2000))"
    inputString = inputString.split(" ").join("")
    inputString = inputString.split(/[()]/)
    let nodes = []
    let links = []
    inputString = inputString.filter(element => {
        if(element !== "") {
           return element
        }
    })
    inputString = inputString.map((element, i) => {
        if(i % 2 === 0) {
            if(i % 4 === 0 && i > 0) {
                console.log(nodes[nodes.length - 2])
                links.push({source: nodes[nodes.length - 2], target: nodes[nodes.length - 1]})
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
            if(node === link.source) {
                newLink["source"] = i
            }
            if( node === link.target) {
                newLink["target"] = i
            }
            return node
        })
        return newLink
    })
    nodeList = nodeList.map(node => JSON.parse(node))
    console.log({nodeList, links})
    return {nodes: nodeList, links: links}
}

export default {
    queryAnswerParser
}