const initialState = {data: [{ "key": undefined, "value": undefined }]}

const clickedNodeDataReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SHOW_NODE_EDGE_DATA':
			return { data: action.data, header: action.header }
		case 'DELETE_NODE_EDGE_DATA':
			return initialState
		default:
			return state
	}
}

export default clickedNodeDataReducer