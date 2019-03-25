const initialState = {data: [{ "key": undefined, "value": undefined }]}

const clickedNodeDataReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_NODE_DATA':
			return { data: action.data }
		case 'DELETE_NODE_DATA':
			return initialState
		default:
			return state
	}
}

export default clickedNodeDataReducer