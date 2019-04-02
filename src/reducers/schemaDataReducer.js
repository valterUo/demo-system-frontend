const initialState = {schema: {}, key: ""}

const schemaDataReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_SCHEMA_DATA':
			return { schema: action.data, key: action.key }
		case 'DELETE_SCHEMA_DATA':
			return initialState
		default:
			return state
	}
}

export default schemaDataReducer