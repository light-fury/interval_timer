import { combineReducers } from 'redux';
import { reducer as tempReducer } from './Temp/reducer';

export const reducer = combineReducers({
	temp: tempReducer,
});
