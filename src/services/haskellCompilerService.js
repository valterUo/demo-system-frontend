import axios from 'axios'

const compile = async (command) => {
    const answer = await axios.post('http://localhost:3002/query', command, { headers: {'Content-Type': 'text/plain'} })
    console.log(answer)
    //console.log(parseJSONList(answer.data))
    if(answer.data.indexOf(']') === answer.data.indexOf('[') + 1) {
        return null
    } else {
        return parseJSONList(answer.data)
    }
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

export default { compile, JSONtoRelationalTables }