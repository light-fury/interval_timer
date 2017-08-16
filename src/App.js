/* global XMLHttpRequest */

import React, { Component } from 'react';
import {
	View,
} from 'react-native';
import {
	Navigator,
} from 'react-native-deprecated-custom-components';

import { Provider } from 'react-redux';

import store from 'interval_timer/src/store';
import * as session from 'interval_timer/src/services/session';
import * as routeHistoryActions from 'interval_timer/src/services/routeHistory/actions';
import Splash from 'interval_timer/src/scenes/Splash';

import Main from 'interval_timer/src/scenes/Main';
import Login from 'interval_timer/src/scenes/Login';
import SavedSettings from 'interval_timer/src/scenes/SavedSettings';
// This is used in order to see requests on the Chrome DevTools
XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
	GLOBAL.originalXMLHttpRequest :
	GLOBAL.XMLHttpRequest;

const transition = Navigator.SceneConfigs.HorizontalSwipeJump;
transition.gestures = null;

const routeStack = [
	{ name: 'Main', component: Main },
	{ name: 'Login', component: Login },
	{ name: 'SavedSettings', component: SavedSettings}

];

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			initialRoute: null,
		};
	}

	componentDidMount() {
		// Waits for the redux store to be populated with the previously saved state,
		// then it will try to auto-login the user.
		const unsubscribe = store.subscribe(() => {
			if (store.getState().services.persist.isHydrated) {
				unsubscribe();
				this.autoLogin();
			}
		});
	}

	autoLogin() {
		session.check().then(() => {
			this.setState({ initialRoute: routeStack[0] });
		}).catch(() => {
			this.setState({ initialRoute: routeStack[0] });
		});
	}

	renderContent() {
		if (!this.state.initialRoute) {
			return <Splash />;
		}

		return (
			<Navigator
				initialRoute={this.state.initialRoute}
				initialRouteStack={routeStack}
				configureScene={() => Navigator.SceneConfigs.HorizontalSwipeJump}
				onWillFocus={route => store.dispatch(routeHistoryActions.push(route))}
				renderScene={(route, navigator) =>
					<route.component route={route} navigator={navigator} {...route.passProps} />
				}
			/>
		);
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: '#eee' }}>
				<Provider store={store}>
					{this.renderContent()}
				</Provider>
			</View>
		);
	}
}

export default App;
