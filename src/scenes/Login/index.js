import React, { Component, PropTypes } from 'react';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import { StyleSheet, AsyncStorage, View, Text, Image, TouchableOpacity, Linking, Dimensions, Platform, TouchableHighlight, Modal, TextInput } from 'react-native'
import {
	Container,
	Header,
	Title,
	Button,
	Footer,
	FooterTab,
	Icon,
	Content,
	Body,
} from 'native-base';
import validator from 'validator';

import Sound from 'react-native-sound';
import { width, height, totalSize } from 'react-native-dimension';
import { EventRegister } from 'react-native-event-listeners';
var reactMixin = require('react-mixin');
var toInteger = require('to-integer');
import styleVars from '../../tools/styleVars';
import AndroidBackButton from 'react-native-android-back-button';
import ProgressCircle from 'react-native-progress-circle'
import FormMessage from 'interval_timer/src/components/FormMessage';
import * as session from 'interval_timer/src/services/session';
import * as api from 'interval_timer/src/services/api';
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

class Login extends Component {
	mixins = [reactMixin];
	static propTypes = {
		navigator: PropTypes.shape({
			getCurrentRoutes: PropTypes.func,
			jumpTo: PropTypes.func,
		}),
	}

	constructor(props) {
		super(props);

		this.initialState = {
			isLoading: false,
			error: null,
			email: '',
			password: '',
			countSet: 1,
			myNumber: '1',
			workoutTime: 10,
			workoutTimeText: '10',
			workoutTimeUnit: 'sec',
			restTime: 10,
			restTimeText: '10',
			currentPercent: 100,
			restTimeUnit: 'sec',
			buttonType: 0,
			preparingTime: 3,
			currentCountType: I18n.t('workout_label'),
			currentCount: 0,
			currentTime: 0,
			saveModalVisible: false,
			intervalId: 0,
			timerBackColor: 'white',
			currentTimeText: '0',
			currentUnit:'sec',
			settingName: 'setting1',
			stopButtonColor: styleVars.colors.primaryBackground,
			stopButtonTextColor: styleVars.colors.primaryFont,
		};
		this.state = this.initialState;
	}

	componentDidMount() {
		this.reloadTimerData();
		this.listener = EventRegister.addEventListener('onTimerStarted', (data) => {
			this.reloadTimerData();
		})
		// 'CountdownNumber.mp3'
		Sound.setCategory('Playback');
	}

	updateTimerData(){
		if (this.state.preparingTime > 0) {
			let tempTime = this.state.preparingTime - 1;
			this.setState({
				currentTime: tempTime, currentUnit: 'sec',
				currentCountType: I18n.t('preparing_label'), currentTimeText: tempTime.toString()
			});
			//  Workout Time ended

			this.setState({ currentPercent: (tempTime * 100 / 5) });
			this.setState({preparingTime: tempTime });
			if (tempTime == 0){
				this.setState({ currentTime: this.state.workoutTime, currentUnit: this.state.workoutTimeUnit,
					currentCountType: I18n.t('workout_label'), currentTimeText: this.state.workoutTimeText });
				this.setState({ currentPercent: 100 });
				this.setState({timerBackColor: 'green'});
			}
		}
		else {
			if (this.state.buttonType == 0){
				// Workout Timer
				if (this.state.currentTime == 0){
					this.setState({buttonType: 1})
					this.setState({
						currentTime: this.state.restTime, currentUnit: this.state.restTimeUnit,
						currentCountType: I18n.t('rest_label'), currentTimeText: this.state.restTimeText
					});
					//  Workout Time ended
					this.setState({ timerBackColor: 'yellow' });
					this.setState({currentPercent:100});
				}
				else {
					let tempTime = this.state.currentTime - 1;
					
					if (this.state.currentTime <= 4 && this.state.currentTime >= 2) {
						var whoosh = new Sound('CountdownNumber.mp3', Sound.MAIN_BUNDLE, (error) => {
							whoosh.play((success) => {
							});
							
						});

						// Play the sound with an onEnd callback
						

						// Ring
					}
					if (tempTime >= 60)
					{
						let val = tempTime / 60;
						let tempVal = 0;
						for (var index = 0; val >= 0; index++) {
							val = val - 1;
							tempVal = tempVal + 1;
						}
						val = tempVal;
						let tempText = val.toString();
						let tempUnit = 'min';
						this.setState({currentUnit: tempUnit, currentTimeText: tempText});
					}
					else {
						let tempText = tempTime.toString();
						let tempUnit = 'sec';
						this.setState({ currentUnit: tempUnit, currentTimeText: tempText });
					}
					
					this.setState({currentPercent : tempTime * 100 / this.state.workoutTime});
					this.setState({ currentTime: tempTime });
				}
				
			}
			else {
				// Rest Timer
				if (this.state.currentTime == 0) {
					this.setState({currentCount: this.state.currentCount - 1});
					if (this.state.currentCount <= 0)
					{
						clearInterval(this.state.intervalId);
						this.setState({ timerBackColor: 'white' });
						this.setSaveModalVisible(true);
						// Timer Ended
						return;
					}
					this.setState({ buttonType: 0 })
					this.setState({ currentTime: this.state.workoutTime, currentUnit: this.state.workoutTimeUnit, 
						currentCountType: I18n.t('workout_label'), currentTimeText: this.state.workoutTimeText });
					//Rest Time ended
					this.setState({ currentPercent: 100 });
					this.setState({ timerBackColor: 'green' });
				}
				else {
					let tempTime = this.state.currentTime - 1;
					
					if (this.state.currentTime <= 4 && this.state.currentTime >= 2) {
						var whoosh = new Sound('CountdownNumber.mp3', Sound.MAIN_BUNDLE, (error) => {
							whoosh.play((success) => {
							});

						});
						// Ring
					}
					if (tempTime >= 60) {
						let val = tempTime / 60;
						let tempVal = 0;
						for (var index = 0; val >= 0; index++) {
							val = val - 1;
							tempVal = tempVal + 1;
						}
						val = tempVal;
						let tempText = val.toString();
						let tempUnit = 'min';
						this.setState({ currentUnit: tempUnit, currentTimeText: tempText });
					}
					else {
						let tempText = tempTime.toString();
						let tempUnit = 'sec';
						this.setState({ currentUnit: tempUnit, currentTimeText: tempText });
					}
					this.setState({ currentPercent: tempTime * 100 / this.state.workoutTime });
					this.setState({ currentTime: tempTime });
				}
			}
		}
	}

	reloadTimerData(){
		AsyncStorage.getItem('currentName').then((value) => {
			if (value != null) {
				this.setState({ settingName: value });
			}
		}).done();
		AsyncStorage.getItem('currentWorkout').then((value) => {
			if (value != null) {
				let tempTime = 0;
				for (var index = 0; index < value.length; index++) {
					tempTime = tempTime * 10 + value.charCodeAt(index) - "0".charCodeAt(0);
				}
				let tempText = '';
				let unitText = 'sec';
				if (tempTime < 60) {
					tempText = tempTime.toString();
				}
				else {
					let tempVal = tempTime / 60;
					tempText = tempVal.toString();
					unitText = 'min';
				}
				this.setState({ workoutTime: tempTime, workoutTimeText: tempText, workoutTimeUnit: unitText });
				this.setState({ currentTime: 5, currentUnit: 'sec', currentCountType: I18n.t('preparing_label'), currentTimeText: '5'});
			}
		}).done();
		AsyncStorage.getItem('currentRest').then((value) => {
			if (value != null) {
				let tempTime = 0;
				for (var index = 0; index < value.length; index++) {
					tempTime = tempTime * 10 + value.charCodeAt(index) - "0".charCodeAt(0);
				}
				let tempText = '';
				let unitText = 'sec';
				if (tempTime < 60) {
					tempText = tempTime.toString();
				}
				else {
					let tempVal = tempTime / 60;
					tempText = tempVal.toString();
					unitText = 'min';
				}
				this.setState({ restTime: tempTime, restTimeText: tempText, restTimeUnit: unitText });
			}
		}).done();
		AsyncStorage.getItem('currentCount').then((value) => {
			if (value != null) {
				let tempCount = 0;
				for (var index = 0; index < value.length; index++) {
					tempCount = tempCount * 10 + value.charCodeAt(index) - "0".charCodeAt(0);
				}
				this.setState({ myNumber: value, countSet: tempCount , currentCount: tempCount, currentPercent: 100});
			}
		}).done();
		if (this.state.intervalId != 0) {
			clearInterval(this.state.intervalId);
		}
		let intervalId = setInterval(() => {
			this.updateTimerData();
		}, 1000);
		this.setState({ intervalId: intervalId });
		this.setState({ preparingTime: 5 });
		this.setState({ timerBackColor: 'white' });
	}

	setSaveModalVisible(visible) {
		this.setState({ saveModalVisible: visible });
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.listener)
	}

	onPressBack() {
		if (this.state.intervalId != 0) {
			clearInterval(this.state.intervalId);
		}
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[0]);
	}

	onStopButtonPress() {
		if (this.state.intervalId != 0) {
			clearInterval(this.state.intervalId);
		}
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[0]);
	}

	renderError() {
		if (this.state.error) {
			return (
				<Text
					style={{ color: 'red', marginBottom: 20 }}
				>
					{this.state.error}
				</Text>
			);
		}
	}

	render() {
		return (
			<Container>
				<Header>
				</Header>
				<Content>
					<View style={{ flexDirection: 'column', backgroundColor: this.state.timerBackColor, height: height(90) }}>
						<Text style={styles.headerText}>{this.state.settingName}</Text>
						<View style={{width:width(60), height: width(60), left: width(20), marginTop:50}}>
							<ProgressCircle
								percent={this.state.currentPercent}
								radius={width(30)}
								borderWidth={15}
								color="blue"
								shadowColor="#999"
								bgColor="#fff"
							>
							<View style={{flexDirection: 'column'}}>
								<View style={{ flexDirection: 'row' }}>
									<Text style={styles.textLabelText}>{this.state.currentCountType}</Text>
								</View>
								<View style={{ flexDirection: 'row', height:80 }}>
										<Text style={styles.circle1Text}>{this.state.currentTimeText}</Text>
										<Text style={styles.circle2Text}>{this.state.currentUnit}</Text>
								</View>
							</View>
							</ProgressCircle>
						</View>
						<TouchableHighlight underlayColor={this.state.stopButtonColor}
							style={[styles.startButton, { backgroundColor: this.state.stopButtonColor, borderColor: this.state.stopButtonTextColor }]}
							onPress={() => this.onStopButtonPress()} >
							<Text style={{ fontSize: 24.5, fontFamily: styleVars.fonts.main, fontStyle: 'italic', color: this.state.stopButtonTextColor }}>{I18n.t('stop_label')}</Text>
						</TouchableHighlight>

						{/* <View style={{position:'absolute', top: height(80.5),height: height(10),left:0, width:width(100)}}>
							<View style={{backgroundColor: styleVars.colors.buttonBackground,
								borderColor: styleVars.colors.buttonBorder,
								borderWidth: 1,
								borderRadius: 0 , flex:1}}>
								<Text style={{paddingTop:5,
									fontFamily: styleVars.fonts.main,
									fontSize: 40,
									color: styleVars.colors.buttonBorder,textAlignVertical:'center',
									textAlign: 'center'}}>ads</Text>
							</View>
						</View> */}
					</View>
					<Modal
						animationType={"fade"}
						transparent={true}
						visible={this.state.saveModalVisible}
						onRequestClose={() => { alert("Modal has been closed.") }}
					>
						<View>
							<View style={{
								borderWidth: 2, borderColor: styleVars.colors.buttonBorder, borderRadius: 3,
								position: 'absolute', left: 50, right: 50, top: height(20), height: height(40), backgroundColor: styleVars.colors.white
							}}>
								<View style={[styles.subModalView, { alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }]}>
									<Text style={[styles.textLabelText, { alignSelf: 'flex-end', fontSize: 23 }]}>Finished</Text>
								</View>
								
								<View style={styles.subModalView}>
									<Button style={[styles.button, { width: width(100) - 124, borderRadius: 10, justifyContent: 'center' }]}
										onPress={() => { this.setSaveModalVisible(!this.state.saveModalVisible); this.onStopButtonPress(); }}>
										<Text style={[styles.button1Text, {
											marginLeft: 20,
											fontSize: 24.5, textAlign: 'center', left: 0, color: styleVars.colors.white, width: width(100) - 146
										}]}>{I18n.t('perform_label')}</Text>
									</Button>
								</View>
							</View>

						</View>
					</Modal>
					<AndroidBackButton
						onPress={() => this.onPressBack()}
					/>
				</Content>
				<AdMobBanner
					bannerSize="smartBannerPortrait"
					adUnitID={BANNER_UNIT_ID}
					testDeviceID="EMULATOR"
					didFailToReceiveAdWithError={this.bannerError} />
			</Container>
		);
	}
}

const styles = StyleSheet.create({

	subModalView: {
		height: height(8),
		margin: 10,
		marginTop: 5,
		marginBottom: 5,
		flexDirection: 'row'
	},
	headerText: {
		fontFamily: styleVars.fonts.main,
		fontSize: 40,
		textAlign: 'center',
		fontWeight: '100',
		color: styleVars.colors.fontSub
	},

	circle1Text: {
		fontFamily: styleVars.fonts.main,
		fontSize: 60,
		textAlign: 'center',
		fontWeight: '100',
		color: styleVars.colors.fontSub
	},

	startButton: {
		marginTop: 80,
		borderColor: styleVars.colors.buttonBorder,
		borderWidth: 1,
		height: height(8),
		width: width(50),
		borderRadius: height(4),
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center'
	},

	circle2Text: {
		fontFamily: styleVars.fonts.main,
		fontSize: 20,
		textAlign: 'center',
		top:40,
		left: 10,
		fontWeight: '100',
		color: styleVars.colors.fontSub
	},

	textLabelText: {
		fontFamily: styleVars.fonts.main,
		fontSize: 15,
		color: styleVars.colors.fontSub
	},
	
	button1Text: {
		position: 'absolute',
		fontFamily: styleVars.fonts.main,
		fontSize: 50,
		color: styleVars.colors.buttonBorder,
		justifyContent: 'center',
		left: width(30),
		width: width(45)
	},
})

export default Login;
