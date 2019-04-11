import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import clickedNodeDataReducer from './reducers/clickedNodeDataReducer'
import queriedDataReducer from './reducers/queriedDataReducer'
import schemaDataReducer from './reducers/schemaDataReducer'
import addNodeReducer from './reducers/addNodeReducer'
import notificationReducer from './reducers/notificationReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

const reducer = combineReducers({
	nodeData: clickedNodeDataReducer,
	queriedDemoData: queriedDataReducer,
	schemaData: schemaDataReducer,
	nodeModelData: addNodeReducer,
	notification: notificationReducer
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store