import axios from 'axios'

const compile = async (command) => {
    const answer = await axios.post('http://localhost:3001/ml', command, { headers: {'Content-Type': 'text/plain'} })
    console.log(answer)
    return answer
}

export default { compile }