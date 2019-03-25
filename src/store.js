import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import clickedNodeDataReducer from './reducers/clickedNodeDataReducer'
import queriedDataReducer from './reducers/queriedDataReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

const reducer = combineReducers({
	nodeData: clickedNodeDataReducer,
	queriedDemoData: queriedDataReducer
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store