import axios from 'axios'

const compileRelationalQuery = async (command) => {
    const answer = await axios.post('http://localhost:3002/query', "wrapListToJSON $ " + command, { headers: { 'Content-Type': 'text/plain' } })
    return answer.data
}

const compileGraphQuery = async (command) => {
    const answer = await axios.post('http://localhost:3002/query', "encode $ constructD3Graph (" + command + ") customerId customerGraph", { headers: { 'Content-Type': 'text/plain' } })
    console.log(answer)
    let graphData
    if(answer.data.includes("nodes") && answer.data.includes("links")) {
        graphData = parseJSONStringtoD3js(answer.data)
    }
    return graphData
}

const parseJSONList = (listString) => {
    let m = listString.indexOf('{') - 1
    console.log(m)
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
    console.log(returndata)
    return returndata
}

const parseJSONStringtoD3js = (jsonString) => {
    let m = jsonString.indexOf('{') - 1
    console.log(m)
    let n = jsonString.lastIndexOf('}')
    jsonString = jsonString.substring(m !== -1 ? m : 0, n !== -1 ? n : jsonString.length)
    jsonString = jsonString + '}"'
    let obj = JSON.parse(JSON.parse(jsonString))
    obj["nodes"] = obj["nodes"].map(node => JSON.parse(node))
    return obj
}

export default { compileRelationalQuery, compileGraphQuery, JSONtoRelationalTables, parseJSONStringtoD3js, parseJSONList }