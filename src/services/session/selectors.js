import store from 'interval_timer/src/store';

export const get = () => store.getState().services.session;
