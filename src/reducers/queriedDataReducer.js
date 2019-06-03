const initialState = [{ "sql": undefined, "document": undefined, "graph": undefined }]

const queriedDataReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_DATA':
			return { data: action.data, model: action.model, key: action.key }
		case 'DELETE_DATA':
			return initialState
		default:
			return state
	}
}

export default queriedDataReducer