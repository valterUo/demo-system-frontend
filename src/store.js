import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import queriedDataReducer from './reducers/queriedDataReducer'
import { composeWithDevTools } from 'redux-devtools-extension';

const reducer = combineReducers({
	queriedData: queriedDataReducer
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store