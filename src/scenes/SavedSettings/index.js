import React, { Component, PropTypes } from 'react';
import {
	StyleSheet, View, Text, Image, TouchableOpacity, Linking, Dimensions, AsyncStorage,
	Platform, TouchableHighlight, Modal, TextInput, FlatList, AppState} from 'react-native'
import {
	Container,
	Header,
	Title,
	Button,
	Footer,
	FooterTab,
	InputGroup,
	Icon,
	Content,
	Body,
} from 'native-base';
import { EventRegister } from 'react-native-event-listeners';
import { width, height, totalSize } from 'react-native-dimension';
import styleVars from '../../tools/styleVars';
import DeviceInfo from 'react-native-device-info'
import I18n from '../../i18n/i18n';
import {
	AdMobBanner,
	AdMobInterstitial
} from 'react-native-admob'

const BANNER_UNIT_ID = Platform.select({
	ios: "ca-app-pub-4233991705945268/4103513314",
	android: "ca-app-pub-4233991705945268/5580246516",
});
const INTERSTISIAL_UNIT_ID = Platform.select({
	ios: "ca-app-pub-4233991705945268/1636117712",
	android: "ca-app-pub-4233991705945268/8681706516",
});
class SavedSettings extends Component {
	static propTypes = {
		navigator: PropTypes.shape({
			getCurrentRoutes: PropTypes.func,
			jumpTo: PropTypes.func,
		}),
	}

	componentDidMount() {
		this.reloadListData();
		this.listener = EventRegister.addEventListener('onSavedSettingsChanged', (data) => {
			this.reloadListData();
		})
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.listener)
	}

	constructor(props) {
		super(props);

		this.initialState = {
			isLoading: false,
			error: null,
			email: '',
			settingsCount: '0',
			countSet: '0',
			currentAppState: '',
			myNumber: '1',
			settingName: 'setting1',
			password: '',
			settingsNames: [],
			workoutTimes: [],
			restTimes: [],
			setCounts: [],
			currentSetting: '0',
			listData:[],
		};
		this.state = this.initialState;
		this.state.currentAppState = AppState.currentState;
	}
	// this.state = {
	// 	buttonColor: styleVars.colors.white// default button color goes here
	// };
	onButton1Press = () => {

		this.setSaveModalVisible(true)
	}
	showSavedSetting (value){

		console.log(value);
		AsyncStorage.setItem('currentName', this.state.settingsNames[value]);
		AsyncStorage.setItem('currentWorkout', this.state.workoutTimes[value].toString());
		AsyncStorage.setItem('currentRest', this.state.restTimes[value].toString());
		AsyncStorage.setItem('currentCount', this.state.setCounts[value].toString());
		
		EventRegister.emit('onSavedSettingsChoosed', 'it works!!!');
		console.log(this.state.settingsNames[value]);
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[0]);
	}

	onSavedSettingsButtonPressed = () => {
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[2]);
	}

	reloadListData(){
		AsyncStorage.getItem('settingsNames')
			.then(req => JSON.parse(req))
			.then(json => {
				this.setState({ settingsNames: json });
				this.setState({ listData: [] });
				let data = [];
				for (var index = 0; index < json.length; index++) {
					if (data.indexOf({ title: json[index] }) >= 0)
						continue;
					data.push({ key: index, title: json[index] });
				}

				this.setState({ listData: data });
			})
			.catch(error => console.log('error!'));
		AsyncStorage.getItem('workoutTimes')
			.then(req => JSON.parse(req))
			.then(json => { if (json != null) { this.setState({ workoutTimes: json }) } })
			.catch(error => console.log('error!'));
		AsyncStorage.getItem('restTimes')
			.then(req => JSON.parse(req))
			.then(json => { if (json != null) { this.setState({ restTimes: json }) } })
			.catch(error => console.log('error!'));
		AsyncStorage.getItem('setCounts')
			.then(req => JSON.parse(req))
			.then(json => { if (json != null) { this.setState({ setCounts: json }) } })
			.catch(error => console.log('error!'));
	}

	onPressBack = () => {
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[0]);
	}

	onTimerButtonPressed = () => {
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[0]);
	}
	bannerError(){
		console.log('Banner error!!!!!!!!!!!!!!!!');
	}

	render() {
	return (
		<Container>
			<Header>
				<Button
					onPress={() => this.onPressBack()}
					title="Learn More"
					transparent
				>
					<Icon name="ios-arrow-back" style={{ color: '#3CA1F2' }} />
				</Button>
				<Body>
					<Title style={{ fontFamily: styleVars.fonts.main }}>{I18n.t('saved_setting_label')}</Title>
				</Body>
			</Header>
			<Content style={{ backgroundColor: styleVars.colors.white }}>
				<FlatList
					data={this.state.listData}
					renderItem={({ item }) => <InputGroup>
						<Button style={{ flex: 10 }} transparent onPress={() => {
							this.showSavedSetting(item.key)
						}}>
							<Text style={{ fontWeight: 'bold', fontFamily: styleVars.fonts.main }}>{item.title}</Text>
						</Button>
						<Button style={{ flex: 1 }} transparent onPress={() => {
							this.showSavedSetting(item.key)
						}}>
							<Text style={{ color: '#96999f' }}>></Text>
						</Button>
					</InputGroup>}
				/>
				
				
			</Content>
			<AdMobBanner
					bannerSize="smartBannerPortrait"
					adUnitID={BANNER_UNIT_ID}
					testDeviceID="EMULATOR"
					didFailToReceiveAdWithError={this.bannerError} />
			<Footer>
				<FooterTab>
					<Button style={{ borderWidth: 1, borderRadius: 0, borderColor: styleVars.colors.buttonBorder }} onPress={() => this.onTimerButtonPressed()}><Icon name='ios-timer-outline' /><Text style={styles.headerLabelText}>{I18n.t('timer_label')}</Text></Button>
					<Button style={{ borderWidth: 1, borderLeftWidth: 0, borderRadius: 0, borderColor: styleVars.colors.buttonBorder }} onPress={() => this.onSavedSettingsButtonPressed()}><Icon name='ios-list' /><Text style={styles.headerLabelText}>{I18n.t('saved_setting_label')}</Text></Button>
				</FooterTab>
			</Footer>
		</Container>
	);
	}
};



const styles = StyleSheet.create({

	subModalText: {
		padding: 0,
		fontFamily: styleVars.fonts.main,
		fontSize: 25,
		color: styleVars.colors.buttonBorder
	},

	subModalButton: {
		flex:1,
		marginRight:5,
		padding:0,
		marginLeft: 0,
		backgroundColor: styleVars.colors.buttonBackground,
		borderColor: styleVars.colors.buttonBorder,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 0
	},

	subModalView: {
		height: height(8),
		margin: 10,
		marginTop: 5,
		marginBottom: 5,
		flexDirection: 'row'
	},

	adView: {
		flex: 1,
		marginLeft: 20,
		margin: 10
	},

	startButton: {
		margin: 5,
		borderColor: styleVars.colors.buttonBorder,
		borderWidth: 1,
		height: height(8),
		borderRadius: height(4),
		alignItems: 'center',
		justifyContent: 'center'
	},

	button: {
		flex: 1,
		marginTop: 5,
		backgroundColor: styleVars.colors.buttonBackground,
		borderColor: styleVars.colors.buttonBorder,
		width: width(90),
		borderWidth: 1,
		borderRadius: 0,
		flexDirection: 'row'
	},

	button1Text: {
		position:'absolute',
		fontFamily: styleVars.fonts.main,
		fontSize: 50,
		color: styleVars.colors.buttonBorder, 
		justifyContent: 'center',
		left: width(30),
		width: width(45)
	},

	button2Text: {
		position: 'absolute',
		fontFamily: styleVars.fonts.main,
		fontSize: 25,
		color: styleVars.colors.buttonBorder,
		flex: 1,
		top: height(6),
		left: width(50),
		width: width(30)
	},

	headerText: {
		fontFamily: styleVars.fonts.main,
		fontSize: 20,
		fontWeight: '100'
	},

	headerLabelText: {
		fontFamily: styleVars.fonts.main,
		fontSize: 12,
		color: styleVars.colors.fontSub
	},

	textLabelText: {
		fontFamily: styleVars.fonts.main,
		fontSize: 15,
		color: styleVars.colors.fontSub
	}

})

export default SavedSettings;
