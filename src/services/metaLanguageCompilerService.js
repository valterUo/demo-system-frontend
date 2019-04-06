import axios from 'axios'

const compile = async (command) => {
    const answer = await axios.post('http://localhost:3002/ml', {"command": command})
    console.log(answer)
    return answer
}

export default { compile }