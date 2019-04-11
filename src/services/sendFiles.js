import axios from 'axios'
import Notification from '../actions/NotificationAction'

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
        console.log("here")
        let variant = "error"
        let message = "Server failed to process the file."
        if(answer.status === 200) {
            variant = "success"
            message = answer.data
        }
        Notification.notify(message, variant)
    }
    await reader.readAsText(file)
    return answer
}

export default { sendFiles }