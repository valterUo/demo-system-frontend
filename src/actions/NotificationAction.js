import store from '../store'

const notify = (message, variant) => {
    store.dispatch({
        type: 'ADD_NOTIFICATION',
        message: message,
        variant: variant
    })
    setTimeout(() => {
        store.dispatch({
            type: 'DELETE_NOTIFICATION'
        })  
    }, 5000)
}

export default { notify }