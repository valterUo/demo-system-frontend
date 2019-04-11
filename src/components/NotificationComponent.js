import React, { Component } from 'react'
import Alert from 'react-bootstrap/Alert'
import store from '../store'

class NotificationComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: "",
            variant: ""
        }
    }

    handleStoreChange = () => {
        if (this.state.message !== store.getState().notification.message) {
            this.setState({
                message: store.getState().notification.message,
                variant: store.getState().notification.variant
            })
        }
    }

    render() {
        store.subscribe(this.handleStoreChange)

        if (this.state.message !== "") {
            return <Alert key= {this.state.message} variant={this.state.variant}>
            {this.state.message}
            </Alert>
        } else {
            return null
        }
    }
}
export default NotificationComponent