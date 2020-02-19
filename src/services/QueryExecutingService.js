import axios from 'axios'
import Notification from '../actions/NotificationAction'

const executeQuery = async (query) => {
    const queryObject = { "originalQuery": query }
    const answer = await axios.post('http://localhost:8080/executeQuery', queryObject, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(function (error) {
        if (error.response) {
            // Request made and server responded
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
            if(typeof error.response.data === "object") {
                Notification.notify(error.response.data["message"], "warning")
            } else {
                Notification.notify(error.response.data, "warning")
            }
            
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request)
            Notification.notify("Request sent but no response. Possible reason: backend is terminated.", "warning")
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
            Notification.notify(error.message, "warning")
        }
    })
    return answer
}

const getSelectiveQueryResultById = async (id) => {
    const answer = await axios.get('http://localhost:8080/selectiveQueryResults/' + id)
        .catch(function (error) {
            if (error.response) {
                // Request made and server responded
                console.log(error.response.data)
                console.log(error.response.status)
                console.log(error.response.headers)
                if(typeof error.response.data === "object") {
                    Notification.notify(error.response.data["message"], "warning")
                } else {
                    Notification.notify(error.response.data, "warning")
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request)
                Notification.notify("Request sent but no response. Possible reason: backend is terminated.", "warning")
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message)
                Notification.notify(error.message, "warning")
            }
        })
    return answer
}

export default { executeQuery, getSelectiveQueryResultById }