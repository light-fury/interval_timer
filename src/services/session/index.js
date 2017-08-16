import store from 'interval_timer/src/store';

import * as api from './api';
import * as selectors from './selectors';
import * as actionCreators from './actions';
import { initialState } from './reducer';

const clearSession = () => {
	store.dispatch(actionCreators.update(initialState));
};

const onRequestSuccess = (response) => {
	if (response && response.token) {
		store.dispatch(actionCreators.update({ token: response.token }));
	}
};

const onRequestFailed = (exception) => {
	clearSession();
	throw exception;
};

export const check = () => {
	const session = selectors.get();

	if (!session.token) {
//		console.log('check rejectioin');
		return Promise.reject();
	}

	return api.check(session.token)
	.then(onRequestSuccess)
	.catch(onRequestFailed);
};

export const signin = (email, password) =>
	api.signin(email, password)
	.then(onRequestSuccess)
	.catch(onRequestFailed);

export const signup = (firstname, lastname, email, password) =>
	api.signup(firstname, lastname, email, password)
	.then(onRequestSuccess)
	.catch(onRequestFailed);

export const logout = () => {
	const session = selectors.get();
	return api.logout(session.token)
	.then(clearSession())
	.catch(() => {});
};

export const aocpoints = (lat1, lng1, lat2, lng2, type, date) => {
	const session = selectors.get();


	if (!session.token) {
//		console.log('aocpoints rejectioin');
		return Promise.reject();
	}

	return api.aocpoints(session.token, lat1, lng1, lat2, lng2, type, date);
};

export const addpoint = (lat, lng, type, date, radius, label) => {
	const session = selectors.get();


	if (!session.token) {
//		console.log('aocpoints rejectioin');
		return Promise.reject();
	}

	return api.addpoint(session.token, lat, lng, type, date, radius, label);
};
