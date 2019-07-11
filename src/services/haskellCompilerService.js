import axios from 'axios'

const compile = async (command) => {
    const answer = await axios.post('http://localhost:3002/query', command, { headers: {'Content-Type': 'text/plain'} })
    console.log(answer.data)
    return answer.data
}

const parseJSONList = (listString) => {
    let n = listString.indexOf(']')
    listString = listString.substring(1, n !== -1 ? n : listString.length)
    if(listString.indexOf('","') !== -1) {
        listString = listString.split('","')
        listString = listString.map((element, index) => {
            if(index === 0) {
                return element + '"'
            } else if (index === listString.length - 1) {
                return '"' + element
            } else {
                return '"' + element + '"'
            }
        })
    } else {
        listString = [listString]
    }
    return listString.map(stringElement => JSON.parse(JSON.parse(stringElement)))
}

const JSONtoRelationalTables = (jsonDataList) => {
    let data = []
    let attributes = Object.keys(jsonDataList[0])
    data.push(attributes)
    jsonDataList.map(element => data.push(Object.values(element)))
    console.log(data)
    return data
}

const parseJSONStringtoD3js = (jsonString) => {
    let n = jsonString.lastIndexOf('}')
    jsonString = jsonString.substring(0, n !== -1 ? n : jsonString.length)
    jsonString = jsonString + '}"'
    let obj = JSON.parse(JSON.parse(jsonString))
    obj["nodes"] = obj["nodes"].map(node => JSON.parse(node))
    return obj
}

export default { compile, JSONtoRelationalTables, parseJSONStringtoD3js, parseJSONList }