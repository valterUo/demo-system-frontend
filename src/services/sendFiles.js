import axios from 'axios'

const sendFiles = async (file, fileName) => {
    const reader = new FileReader()
    var headers = {
        'Content-Type': 'text/csv',
        'FileName': fileName
    }
    reader.onload = async function (evt) {
        const answer = await axios.post('/files', evt.target.result, { headers: headers })
        console.log(answer)
    }
    reader.readAsText(file)

    return "Success?"
}

export default { sendFiles }