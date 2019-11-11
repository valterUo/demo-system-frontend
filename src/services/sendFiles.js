import axios from 'axios'
import Notification from '../actions/NotificationAction'

const sendFiles = async (file, fileName, variableName, uploadingFunction, progressFunction) => {
    const reader = new FileReader()
    const headers = {
        'Content-Type': 'text/plain',
        'FileName': fileName,
        'UploadingFunction': uploadingFunction,
        'VariableName': variableName
    }

    reader.onprogress = function(evt) {
        if (evt.lengthComputable) {
            let percentLoaded = Math.round((evt.loaded / evt.total) * 100)
            console.log(percentLoaded)
            progressFunction(percentLoaded)
        }
    }

    reader.onload = async function (evt) {
        //console.log(evt.target.result)
        try {
            let answer = await axios.post('http://localhost:3002/fileUpload', evt.target.result, { headers: headers })
            let variant = "error"
            let message = "Server failed to process the file."
            if(answer.status === 200) {
                variant = "success"
                message = answer.data
            }
            console.log(message)
            Notification.notify(message, variant)
            return answer
        } catch(error) {
            console.log(error)
            Notification.notify("The file failed to load!", "danger")
            return "Error"
        }
    }
    await reader.readAsText(file)
}

export default { sendFiles }