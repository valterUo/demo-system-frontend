const initialState = [{ "sql": undefined, "document": undefined, "graph": undefined }]

const queriedDataReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_DATA':
			return { sqlData: action.sqlData, documentData: action.documentData, graphData: action.graphData }
		case 'DELETE_DATA':
			return initialState
		default:
			return state
	}
}

export default queriedDataReducer