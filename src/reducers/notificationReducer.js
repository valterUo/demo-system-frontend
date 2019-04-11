const initialState = {message: "", variant: ""}

const notificationReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_NOTIFICATION':
			return { message: action.message, variant: action.variant }
		case 'DELETE_NOTIFICATION':
			return initialState
		default:
			return state
	}
}

export default notificationReducer