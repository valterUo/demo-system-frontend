const initialState = { acceptEdgeDrawing: false, startingEdge: {}, targetEdge: {}}

const newEdgeReducer = (state = initialState, action) => {
	switch (action.type) {
        case 'ACCEPT_EDGE_DRAWING':
        return Object.assign({}, state, {
            acceptEdgeDrawing: action.acceptEdgeDrawing
          })
        case 'ADD_STARTING_EDGE':
        return Object.assign({}, state, {
            startingEdge: action.startingEdge
          })
        case 'ADD_TARGET_EDGE':
        return Object.assign({}, state, {
            targetEdge: action.targetEdge
          })
        case 'DELETE_ALL_EDGE_DRAWING_DATA':
            return initialState
		default:
			return state
	}
}

export default newEdgeReducer