import * as actionTypes from './actionTypes';


const initialState = {
    date: '',
    lat1: 43.1198091,
    lng1: 131.8869243,
    lat2: 35.59505809999999,
    lng2: -82.5514869,
    PollenSelected: false,
    NoiseSelected: false,
    SmellSelected: false,
    DiagramScene: false,
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
        case actionTypes.SETDATE:
            state.date = action.data;
            break;
        case actionTypes.SETFIRSTPLACE:
            state.lat1 = action.data.lat;
            state.lng1 = action.data.lng;
            break;
        case actionTypes.SETSECONDPLACE:
            state.lat2 = action.data.lat;
            state.lng2 = action.data.lng;
            break;
        case actionTypes.SETPOLLEN:
            state.PollenSelected = action.data;
            break;
        case actionTypes.SETNOISE:
            state.NoiseSelected = action.data;
            break;
        case actionTypes.SETSMELL:
            state.SmellSelected = action.data;
            break;
        case actionTypes.SETDIAGRAMSCENE:
            state.DiagramScene = action.data;
            break;
        default:
            break;
	}
    return state;
};
