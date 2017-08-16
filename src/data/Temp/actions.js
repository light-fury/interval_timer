import * as actionTypes from './actionTypes';

export const setDate = date => ({
	type: actionTypes.SETDATE,
	data: date,
});

export const setFirstPlace = position => ({
	type: actionTypes.SETFIRSTPLACE,
	data: position,
});

export const setSecondPlace = position => ({
	type: actionTypes.SETSECONDPLACE,
	data: position,
});

export const setPollen = value => ({
	type: actionTypes.SETPOLLEN,
	data: value,
});

export const setNoise = value => ({
	type: actionTypes.SETNOISE,
	data: value,
});

export const setSmell = value => ({
	type: actionTypes.SETSMELL,
	data: value,
});

export const setDiagramScene = value => ({
	type: actionTypes.SETDIAGRAMSCENE,
	data: value,
});

export const getState = () => ({
	type: actionTypes.GETSTATE,
});
