import axios from 'axios'

const compileRelationalQuery = async (command) => {
    const answer = await axios.post('http://localhost:3002/query', "wrapListToJSON $ " + command, {
        headers: {
            'Content-Type': 'text/plain'
        }
    })
    let jsonDataList = parseJSONList(answer.data)
    if (jsonDataList !== undefined) {
        if (jsonDataList.length === 0) {
            return undefined
        }
        return JSONtoRelationalTables(jsonDataList)
    }
}

const compileTreeQuery = async (command) => {
    const answer = await axios.post('http://localhost:3002/query', "wrapListToJSON $ " + command, {
        headers: {
            'Content-Type': 'text/plain'
        }
    })
    let jsonDataList = parseJSONList(answer.data)
    if (jsonDataList !== undefined) {
        if (jsonDataList.length === 0) {
            return undefined
        }
        return parseJSONtoTree(jsonDataList)
    }
}

const compileGraphQuery = async (command) => {
    const answer = await axios.post('http://localhost:3002/query', "encode $ createD3Graph $ " + command, {
        headers: {
            'Content-Type': 'text/plain'
        }
    })
    let graphData
    if (answer.data.includes("nodes") && answer.data.includes("links")) {
        graphData = parseJSONStringtoD3js(answer.data)
    }
    return graphData
}

const compileRDFGraphQuery = async (command) => {
    const answer = await axios.post('http://localhost:3002/query', "encode $ rdfTriplesToD3Graph $ triplesOf " + command, {
        headers: {
            'Content-Type': 'text/plain'
        }
    })
    let graphData
    if (answer.data.includes("nodes") && answer.data.includes("links")) {
        graphData = parseJSONStringtoD3js(answer.data)
    }
    console.log(graphData)
    return graphData
}

const compileNimbleGraphQuery = async (command) => {
    const answer = await axios.post('http://localhost:3002/query', "encode $ createD3NimbleGraph $ " + command, {
        headers: {
            'Content-Type': 'text/plain'
        }
    })
    let graphData
    if (answer.data.includes("nodes") && answer.data.includes("links")) {
        graphData = parseJSONStringtoD3js(answer.data)
    }
    console.log(graphData)
    return graphData
}

const parseJSONList = (listString) => {
    let m = listString.indexOf('{') - 1
    let n = listString.indexOf('*')
    listString = listString.substring(m !== -1 ? m : 0, n !== -1 ? n : listString.length)
    listString = listString.replace(/\\/g, "\\\\\\\\")
        .replace(/\\\\\\\\"/g, "\\\"")
        .replace(/\//g, "\\\\/")
    //console.log([listString])
    try {
        listString = JSON.parse(JSON.parse(listString))
        return listString["result"]
    } catch (err) {
        console.log("Error while parsing the JSON in list.")
    }
}

const JSONtoRelationalTables = (jsonDataList) => {
    let data = []
    let subdata = []
    let attributes
    try {
        attributes = Object.keys(jsonDataList[0])
    } catch {
        return undefined
    }
    
    data.push(attributes)
    jsonDataList.map(element => {
        let elements = Object.values(element)
        let acceptedElements = []
        elements.map(element2 => {
            if (typeof element2 === "object") {
                subdata = JSONtoRelationalTables(element2)
                acceptedElements.push("List")
            } else {
                acceptedElements.push(element2)
            }
            return element2
        })
        data.push(acceptedElements)
        return element
    })
    let result = {}
    result["data"] = data
    result["eventKey"] = JSON.stringify(data[0])
    result["title"] = "Result"
    let returndata = [result]
    try {
        subdata.map(e => returndata.push(e))
    } catch {
        return undefined
    }
    
    return returndata
}

const parseJSONStringtoD3js = (jsonString) => {
    let m = jsonString.indexOf('{') - 1
    let n = jsonString.lastIndexOf('}')
    jsonString = jsonString.substring(m !== -1 ? m : 0, n !== -1 ? n : jsonString.length)
    jsonString = jsonString + '}"'
    jsonString = jsonString.replace(/(\\[0-9])/g, "")
    try {
        let obj = JSON.parse(JSON.parse(jsonString))
        obj["nodes"] = obj["nodes"].map(node => {
            // node = node.replace("\\", "")
            // console.log(node)
            return JSON.parse(node)
        })
        if(obj["nodes"][0]["Left"] !== undefined || obj["nodes"][0]["Right"] !== undefined) {
            obj["nodes"] = obj["nodes"].map(node => {
                console.log(node)
                if(node["Left"] !== undefined) {
                    return node["Left"]
                } else if(node["Right"] !== undefined) {
                    return node["Right"]
                }
                return node
            })
        }
        return obj
    } catch (err) {
        console.log("Error while parsing the JSON in Graph.")
    }
    
}

const parseChild = (childElement) => {
    let answer = {
        name: "",
        attributes: {},
        children: []
    }
    Object.keys(childElement).forEach(function (key) {
        if (Array.isArray(childElement[key])) {
            answer.name = key
            childElement[key].map(child => answer.children.push(parseChild(child)))
        } else if (hasJsonStructure(JSON.stringify(childElement[key]))) {
            answer.name = key
            answer.children.push(parseChild(childElement[key]))
        } else {
            answer.attributes[key] = childElement[key]
        }
    })
    return answer
}

const parseJSONtoTree = (jsonDataList) => {
    let answer = {
        name: "root",
        attributes: {},
        children: []
    }
    jsonDataList.map(child => answer.children.push(parseChild(child)))
    return [answer]
}

const hasJsonStructure = (str) => {
    if (typeof str !== 'string') return false
    try {
        const result = JSON.parse(str)
        const type = Object.prototype.toString.call(result)
        return type === '[object Object]' 
            || type === '[object Array]'
    } catch (err) {
        return false
    }
}

export default {
    compileRelationalQuery,
    compileGraphQuery,
    compileTreeQuery,
    compileRDFGraphQuery,
    compileNimbleGraphQuery
}