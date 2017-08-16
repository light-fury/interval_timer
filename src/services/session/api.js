import { fetchApi } from 'interval_timer/src/services/api';

const endPoints = {
	signin: '/signin',
	signup: '/signup',
	check: '/check',
	aocpoints: '/aocpoints',
	logout: '/logout',
	addpoint: '/addpoint',
};

export const signin = (email, password) => fetchApi(endPoints.signin, { email, password }, 'post');

export const signup = (firstname, lastname, email, password) => fetchApi(endPoints.signup, { firstname, lastname, email, password }, 'post');

export const check = token => fetchApi(`${endPoints.check}?token=${token}`);

export const logout = token => fetchApi(`${endPoints.logout}?token=${token}`);

export const aocpoints = (token, lat1, lng1, lat2, lng2, type, date) => {
	const northeast = { lat: lat1, lng: lng1 };
	const southwest = { lat: lat2, lng: lng2 };
	const body = { northeast, southwest, types: type, date };
//	console.log(body);
	return fetchApi(`${endPoints.aocpoints}?token=${token}`,
		body, 'post');
};

export const addpoint = (token, lat, lng, type, date, radius, label) => {
	const body = { lat: lat, lng: lng, type: type, date: date, radius: radius, label: label};
	console.log(body);
	return fetchApi(`${endPoints.addpoint}?token=${token}`,	body, 'post');
};
