import axios from 'axios'

const sendFiles = async (file, fileName) => {
    let answer = undefined
    const reader = new FileReader()
    var headers = {
        'Content-Type': 'text/plain',
        'FileName': fileName
    }
    reader.onload = async function (evt) {
        //console.log(evt.target.result)
        answer = await axios.post('http://localhost:3001/files', evt.target.result, { headers: headers })
        console.log(answer)
    }
    await reader.readAsText(file)
    return answer
}

export default { sendFiles }