import axios from 'axios'

const executeQuery = async (query) => {
    const queryObject = { "originalQuery": query }
    const answer = await axios.post('http://localhost:8080/executeQuery', queryObject, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return answer
}

const getSelectiveQueryResultById = async (id) => {
    const answer = await axios.get('http://localhost:8080/selectiveQueryResults/' + id)
    return answer
}

export default { executeQuery, getSelectiveQueryResultById }