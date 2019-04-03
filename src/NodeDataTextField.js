import React, { Component } from 'react'
import store from './store'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class NodeDataTextField extends Component {
    constructor(props) {
        super(props)
        this.state = {
            textFieldVisible: false,
            textfieldValue: {}
        }
    }

    handleStoreChange = () => {
        if (this.state.textfieldValue !== JSON.stringify(store.getState().nodeModelData.nodeModel) 
        || this.state.textFieldVisible !== store.getState().nodeModelData.textFieldVisible) {
            this.setState({
                textFieldVisible: store.getState().nodeModelData.textFieldVisible,
                textfieldValue: JSON.stringify(store.getState().nodeModelData.nodeModel)
            })
        }
    }

    handleTextFieldChange = (event) => {
        this.setState({
            textfieldValue: event.target.value
        })
    }

    handleNodeDataSubmit = (event) => {
        event.preventDefault()
        const newNode = JSON.parse(this.state.textfieldValue)
        const sourceNode = store.getState().nodeModelData.sourceNode
        store.dispatch({ type: 'DELETE_NODE_MODEL' })
        const oldData = store.getState().schemaData.schema
        const newNodes = oldData.nodes.concat(newNode)
        const newLinks = oldData.links.concat({ "source": sourceNode, "target": newNode, "index": oldData.links.length })
        store.dispatch({ type: 'ADD_SCHEMA_DATA', data: { nodes: newNodes, links: newLinks }, key: newNodes.length })
    }

    render() {
        store.subscribe(this.handleStoreChange)
        return this.state.textFieldVisible === true ? <div style={{ marginBottom: "7px" }}>
            <h4>Enter the data for the new node:</h4>
            <p>(JSON format)</p>
            <Form onSubmit={this.handleNodeDataSubmit}>
                <Form.Control as="textarea" rows="2" value={this.state.textfieldValue} onChange={this.handleTextFieldChange} />
                <Button type="submit" value="Submit" variant="dark">Add</Button>
            </Form>
        </div> : <div />
    }
}

export default NodeDataTextField