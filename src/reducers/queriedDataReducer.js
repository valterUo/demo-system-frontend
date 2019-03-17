const initialState = {}

const queriedDataReducer = (state = initialState, action) => {
	switch (action.type) {
	case 'ADD_DATA':
		return action.data
	case 'DELETE_DATA':
		return initialState
	default:
		return state
	}
}

export default queriedDataReducer