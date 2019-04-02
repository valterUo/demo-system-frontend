const initialState = {textFieldVisible: false, nodeModel: {}, sourceNode: {}}

const addNodeReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_NODE_MODEL':
			return { textFieldVisible: action.textFieldVisible, nodeModel: action.nodeModel, sourceNode: action.sourceNode }
		case 'DELETE_NODE_MODEL':
			return initialState
		default:
			return state
	}
}

export default addNodeReducer