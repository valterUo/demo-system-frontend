import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import queriedDataReducer from './reducers/queriedDataReducer'

const reducer = combineReducers({
	queriedData: queriedDataReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store