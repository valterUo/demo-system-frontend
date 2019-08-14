import axios from 'axios'

const compileRelationalQuery = async (command) => {
    const answer = await axios.post('http://localhost:3002/query', "wrapListToJSON $ " + command, { headers: { 'Content-Type': 'text/plain' } })
    let jsonDataList = parseJSONList(answer.data)
    if (jsonDataList.length === 0) {
        return undefined
    }
    return JSONtoRelationalTables(jsonDataList)
}

const compileTreeQuery = async (command) => {
    const answer = await axios.post('http://localhost:3002/query', "wrapListToJSON $ " + command, { headers: { 'Content-Type': 'text/plain' } })
    let jsonDataList = parseJSONList(answer.data)
    if (jsonDataList.length === 0) {
        return undefined
    }
    return parseJSONtoTree(jsonDataList)
}

const compileGraphQuery = async (command) => {
    const answer = await axios.post('http://localhost:3002/query', "encode $ createD3Graph $ " + command, { headers: { 'Content-Type': 'text/plain' } })
    let graphData
    if(answer.data.includes("nodes") && answer.data.includes("links")) {
        graphData = parseJSONStringtoD3js(answer.data)
    }
    return graphData
}

const parseJSONList = (listString) => {
    let m = listString.indexOf('{') - 1
    let n = listString.indexOf('*')
    listString = listString.substring(m !== -1 ? m : 0, n !== -1 ? n : listString.length)
    listString = JSON.parse(JSON.parse(listString))
    return listString["result"]
}

const JSONtoRelationalTables = (jsonDataList) => {
    let data = []
    let subdata = []
    let attributes = Object.keys(jsonDataList[0])
    data.push(attributes)
    jsonDataList.map(element => {
        let elements = Object.values(element)
        let acceptedElements = []
        elements.map(element2 => {
            if(typeof element2 === "object") {
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
	result["title"] = "Title"
    let returndata = [result]
    subdata.map(e => returndata.push(e))
    return returndata
}

const parseJSONStringtoD3js = (jsonString) => {
    let m = jsonString.indexOf('{') - 1
    let n = jsonString.lastIndexOf('}')
    jsonString = jsonString.substring(m !== -1 ? m : 0, n !== -1 ? n : jsonString.length)
    jsonString = jsonString + '}"'
    let obj = JSON.parse(JSON.parse(jsonString))
    obj["nodes"] = obj["nodes"].map(node => JSON.parse(node))
    return obj
}

const parseChild = (childElement) => {
    let answer = {name: "", attributes: {}, children: []}
    Object.keys(childElement).forEach(function(key) {
        if(Array.isArray(childElement[key])) {
            answer.name = key
            childElement[key].map(child => answer.children.push(parseChild(child)))
        } else {
            answer.attributes[key] = childElement[key]
        }
    })
    return answer
}

const parseJSONtoTree = (jsonDataList) => {
    let answer = {name: "root", attributes: {}, children: []}
    jsonDataList.map(child => answer.children.push(parseChild(child)))
    return [answer]
}

export default { compileRelationalQuery, compileGraphQuery, compileTreeQuery }