import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Linking, Dimensions, AsyncStorage, Platform, TouchableHighlight, Modal , TextInput} from 'react-native'
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

import I18n from '../../i18n/i18n'
import { EventRegister } from 'react-native-event-listeners';
import { width, height, totalSize } from 'react-native-dimension';
import styleVars from '../../tools/styleVars';
import DeviceInfo from 'react-native-device-info'
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
class Main extends Component {
	static propTypes = {
		navigator: PropTypes.shape({
			getCurrentRoutes: PropTypes.func,
			jumpTo: PropTypes.func,
		}),
	}
	componentWillUnmount() {
		EventRegister.removeEventListener(this.listener);
	}

	componentDidMount() {
		AsyncStorage.getItem("settingsCount").then((value) => {
			if (value != null) {
			this.setState({ settingsCount: value});
			AsyncStorage.getItem('settingsNames')
				.then(req => JSON.parse(req))
				.then(json => { if (json != null) {this.setState({settingsNames: json})}})
				.catch(error => console.log('error!'));
			AsyncStorage.getItem('workoutTimes')
				.then(req => JSON.parse(req))
				.then(json => { if (json != null) {this.setState({ workoutTimes: json })} })
				.catch(error => console.log('error!'));
			AsyncStorage.getItem('restTimes')
				.then(req => JSON.parse(req))
				.then(json => { if (json != null) { this.setState({ restTimes: json })} })
				.catch(error => console.log('error!'));
			AsyncStorage.getItem('setCounts')
				.then(req => JSON.parse(req))
				.then(json => { if (json != null) { this.setState({ setCounts: json })} })
				.catch(error => console.log('error!'));
			
			
		}}).done();
		this.reloadCurrentSetting();
		this.listener = EventRegister.addEventListener('onSavedSettingsChoosed', (data) => {
			this.reloadCurrentSetting();
		});
		AdMobInterstitial.setTestDeviceID('EMULATOR');
		AdMobInterstitial.setAdUnitID(INTERSTISIAL_UNIT_ID);
	}

	reloadCurrentSetting(){
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
				this.setState({ myNumber: value, countSet: tempCount });
			}
		}).done();
		console.log("aaaaaaa11111111");
		AdMobInterstitial.requestAd(AdMobInterstitial.showAd((error) => { if (error) console.log(error) }))
	}

	constructor(props) {
		super(props);
		
		this.initialState = {
			isLoading: false,
			error: null,
			email: '',
			button1Color: styleVars.colors.white,
			button2Color: styleVars.colors.primaryBackground,
			button1TextColor: styleVars.colors.primaryFont,
			modalVisible: false,
			countModalVisible: false,
			saveModalVisible: false,
			modalTitle: I18n.t('select_workout_time'),
			settingsCount: '0',
			countSet: 1,
			myNumber: '1',
			workoutTime: 10,
			workoutTimeText: '10',
			workoutTimeUnit: 'sec',
			restTime: 10,
			restTimeText: '10',
			restTimeUnit: 'sec',
			buttonType: 0,
			settingName: 'setting1',
			button2TextColor: styleVars.colors.primaryFont,
			password: '',
			settingsNames: [],
			workoutTimes: [],
			restTimes: [],
			setCounts: []
		};
		this.state = this.initialState;
	}
	// this.state = {
	// 	buttonColor: styleVars.colors.white// default button color goes here
	// };
	onButton1Press = () => {
		this.setSaveModalVisible(true);

	}

	setItems() {
		let tempNum = this.state.settingsCount + 1;
		this.setState({ settingsCount: tempNum});
		AsyncStorage.setItem('settingsCount', this.state.settingsCount);

		let data = this.state.settingsNames;
		data.push(this.state.settingName);
		AsyncStorage.setItem('settingsNames', JSON.stringify(data))
			.then(json => console.log('success!'))
			.catch(error => console.log('error!'));
		this.setState({settingsNames: data});

		data = [];
		data = this.state.workoutTimes;
		data.push(this.state.workoutTime);

		AsyncStorage.setItem('workoutTimes', JSON.stringify(data))
			.then(json => console.log('success!'))
			.catch(error => console.log('error!'));
		this.setState({workoutTimes: data});
		console.log(this.state.settingsNames);
		data = [];
		data = this.state.restTimes;
		data.push(this.state.restTime);


		AsyncStorage.setItem('restTimes', JSON.stringify(data))
			.then(json => console.log('success!'))
			.catch(error => console.log('error!'));
		this.setState({ restTimes: data });
		data = [];
		data = this.state.setCounts;
		data.push(this.state.countSet);

		AsyncStorage.setItem('setCounts', JSON.stringify(data))
			.then(json => console.log('success!'))
			.catch(error => console.log('error!'));
		this.setState({ setCounts: data });
		EventRegister.emit('onSavedSettingsChanged', 'it works!!!');
	}

	onButton2Press = () => {
		AsyncStorage.setItem('currentName', this.state.settingName);
		AsyncStorage.setItem('currentWorkout', this.state.workoutTime.toString());
		AsyncStorage.setItem('currentRest', this.state.restTime.toString());
		AsyncStorage.setItem('currentCount', this.state.myNumber);
		EventRegister.emit('onTimerStarted', 'it works!!!');

		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[1]);
	}

	onSavedSettingsButtonPressed = () => {
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[2]);
	}

	onStartTimer(){
			
	}

	onTimerButtonPressed = () => {
		this.onStartTimer();
	}

	setModalVisible(visible) {
		this.setState({
			modalVisible: visible, buttonType: 0, modalTitle: I18n.t('select_workout_time')});
	}

	setRestModalVisible(visible) {
		this.setState({ modalVisible: visible, buttonType: 1, modalTitle: I18n.t('select_rest_time') });
	}

	setCountModalVisible(visible) {
		this.setState({ countModalVisible: visible});
	}

	setSaveModalVisible(visible) {
		this.setState({ saveModalVisible: visible });
		if (visible == false){
			this.setItems();
		}
	}

	quitSaveModalVisible(visible) {
		this.setState({ saveModalVisible: visible });
	}

	setTime(value){
		if (this.state.buttonType == 0){
			let tempText = '';
			let unitText = 'sec';
			if (value < 60) {
				tempText = value.toString();
			}
			else {
				let tempVal = value / 60;
				tempText = tempVal.toString();
				unitText = 'min';
			}
			this.setState({workoutTime: value, workoutTimeText: tempText, workoutTimeUnit: unitText});
		}
		else {
			let tempText = '';
			let unitText = 'sec';
			if (value < 60) {
				tempText = value.toString();
			}
			else {
				let tempVal = value / 60;
				tempText = tempVal.toString();
				unitText = 'min';
			}
			this.setState({ restTime: value, restTimeText: tempText, restTimeUnit: unitText });
		}
	}

	onChange(text) {
		let newText = '';
		let numbers = '0123456789';
		let finalText = '';
		let tempLength = 0;
		if (text.length > 3) {
			if (text.charAt(0) == '1' && text.charAt(1) == '0' && text.charAt(2) == '0') 
			{
				tempLength = 3
			}
			else {
				tempLength = 2
			}
		}
		else {
			if (text.length == 3) {
				if (text == '100') {
					tempLength = 3
				}
				else {
					tempLength = 2
				}
			}
			else {
				tempLength = text.length
			}
		}
		let temp = 0;
		for (var i = 0; i < tempLength; i++) {
			if (numbers.indexOf(text[i]) > -1) {
				newText += text[i];
				temp = temp * 10 + (text.charCodeAt(i) - "0".charCodeAt(0));
			}
		}
		this.setState({ myNumber: newText, countSet: temp })
	}

	render() {
	return (
		<Container>
			<Header>
				<Body>
					<Title style={styles.headerText}>{I18n.t('timer_setting_title')}</Title>
					<Text style={styles.headerLabelText}>{I18n.t('timer_setting_subtitle')}</Text>
				</Body>
			</Header>
			<Content>
				<View style={{flexDirection: 'column', backgroundColor: styleVars.colors.white}}>
					<View style={styles.subView}>
						<Text style={styles.textLabelText}>{I18n.t('workout_label')}</Text>
						<Button style={styles.button} onPress={() => {
							this.setModalVisible(true)
						}}>
							<Text style={styles.button1Text}>{this.state.workoutTimeText}</Text>
							<Text style={styles.button2Text}>{this.state.workoutTimeUnit}</Text>
						</Button>
					</View>
					<View style={styles.subView}>
						<Text style={styles.textLabelText}>{I18n.t('rest_label')}</Text>
						<Button style={styles.button} onPress={() => {
							this.setRestModalVisible(true)}}>
							<Text style={styles.button1Text}>{this.state.restTimeText}</Text>
							<Text style={styles.button2Text}>{this.state.restTimeUnit}</Text>
						</Button>
					</View>
					<View style={styles.subView}>
						<Text style={styles.textLabelText}>{I18n.t('set_count_label')}</Text>
						<Button style={styles.button} onPress={() => {
							this.setCountModalVisible(true)
						}}>
							<Text style={[styles.button1Text]}>{this.state.myNumber}</Text>
						</Button>
					</View>
					<View style={{
						height: height(8),
						marginLeft: 20,
						margin: 10,
						marginBottom: 5,
						flexDirection: 'row'}}>
						<TouchableHighlight underlayColor={this.state.button1Color} 
							style={[styles.startButton, { flex: 3, backgroundColor: this.state.button1Color, borderColor: this.state.button1TextColor}]}
							onPress={() => this.onButton1Press()} >
							<Text style={{ fontSize: 24.5, fontFamily: styleVars.fonts.main, fontStyle: 'italic', color: this.state.button1TextColor }}>{I18n.t('save_label')}</Text>
						</TouchableHighlight>
						<TouchableHighlight underlayColor={this.state.button2Color} 
							style={[styles.startButton, { flex: 5, backgroundColor: this.state.button2Color, borderColor: this.state.button2TextColor}]} 
							onPress={() => this.onButton2Press()}>
							<Text style={{ fontSize: 24.5, fontFamily: styleVars.fonts.main, fontStyle: 'italic', color: this.state.button2TextColor }}>{I18n.t('start_label')}</Text>
						</TouchableHighlight>
					</View>
					<View style={[styles.subView,{height: height(9), marginLeft: 0, marginBottom:0, backgroundColor:'white'}]}>
						
					</View>
				</View>

				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => { alert("Modal has been closed.") }}
				>
					<View>
						<View style={{ borderWidth: 2,borderColor: styleVars.colors.buttonBorder,borderRadius: 3,
						position:'absolute',left: 50, right: 50, top: height(20), height: height(50), backgroundColor: styleVars.colors.white }}>
							<TouchableHighlight onPress={() => {this.setModalVisible(!this.state.modalVisible)}} 
								underlayColor={styleVars.colors.primaryBackground}
							style={{ position: 'absolute', width:30, right: -15, top: -15, height: 30,borderRadius:15, 
							backgroundColor: styleVars.colors.buttonBackground, borderWidth: 1, borderColor: styleVars.colors.buttonBorder}}>
							<Text style={{width:1, height: 10, left:10, backgroundColor:null, fontSize:1}}></Text>
							</TouchableHighlight>

							<View style={[styles.subModalView, { alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}]}>
								<Text style={[styles.textLabelText,{alignSelf:'flex-end', fontSize:23}]}>{this.state.modalTitle}</Text>
							</View>
							<View style={styles.subModalView}>
								<TouchableHighlight style={styles.subModalButton} onPress={() => this.setTime(10)}>
									<Text style={styles.subModalText}>10s</Text>
								</TouchableHighlight>
								<TouchableHighlight style={styles.subModalButton} onPress={() => this.setTime(15)}>
									<Text style={styles.subModalText}>15s</Text>
								</TouchableHighlight>
								<TouchableHighlight style={styles.subModalButton} onPress={() => this.setTime(20)}>
									<Text style={styles.subModalText}>20s</Text>
								</TouchableHighlight>
								<TouchableHighlight style={styles.subModalButton} onPress={() => this.setTime(30)}>
									<Text style={styles.subModalText}>30s</Text>
								</TouchableHighlight>
							</View>
							<View style={styles.subModalView}>
								<TouchableHighlight style={styles.subModalButton} onPress={() => this.setTime(40)}>
									<Text style={styles.subModalText}>40s</Text>
								</TouchableHighlight>
								<TouchableHighlight style={styles.subModalButton} onPress={() => this.setTime(50)}>
									<Text style={styles.subModalText}>50s</Text>
								</TouchableHighlight>
								<TouchableHighlight style={styles.subModalButton} onPress={() => this.setTime(60)}>
									<Text style={styles.subModalText}>1m</Text>
								</TouchableHighlight>
								<TouchableHighlight style={styles.subModalButton} onPress={() => this.setTime(120)}>
									<Text style={styles.subModalText}>2m</Text>
								</TouchableHighlight>
							</View>
							<View style={styles.subModalView}>
								<TouchableHighlight style={styles.subModalButton} onPress={() => this.setTime(180)}>
									<Text style={styles.subModalText}>3m</Text>
								</TouchableHighlight>
								<TouchableHighlight style={styles.subModalButton} onPress={() => this.setTime(240)}>
									<Text style={styles.subModalText}>4m</Text>
								</TouchableHighlight>
								<TouchableHighlight style={styles.subModalButton} onPress={() => this.setTime(300)}>
									<Text style={styles.subModalText}>5m</Text>
								</TouchableHighlight>
								<TouchableHighlight style={styles.subModalButton} onPress={() => this.setTime(600)}>
									<Text style={styles.subModalText}>10m</Text>
								</TouchableHighlight>
							</View>
							<View style={styles.subModalView}>
								<Button style={[styles.button, { width: width(100)-124, borderRadius: 10 , justifyContent:'center', alignItems: 'center'}]}
									onPress={() => { this.setModalVisible(!this.state.modalVisible) }}>
									<Text style={[styles.button1Text, {
										marginLeft: 20,
										fontSize: 24.5, textAlign: 'center', left: 0, color: styleVars.colors.white, width: width(100) - 146
									}]}>{I18n.t('perform_label')}</Text>
								</Button>
							</View>
						</View>
						
					</View>
				</Modal>

				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.countModalVisible}
					onRequestClose={() => { alert("Modal has been closed.") }}
				>
					<View>
						<View style={{
							borderWidth: 2, borderColor: styleVars.colors.buttonBorder, borderRadius: 3,
							position: 'absolute', left: 50, right: 50, top: height(20), height: height(40), backgroundColor: styleVars.colors.white
						}}>
							<TouchableHighlight onPress={() => { this.setCountModalVisible(!this.state.countModalVisible) }}
								underlayColor={styleVars.colors.primaryBackground}
								style={{
									position: 'absolute', width: 30, right: -15, top: -15, height: 30, borderRadius: 15,
									backgroundColor: styleVars.colors.buttonBackground, borderWidth: 1, borderColor: styleVars.colors.buttonBorder
								}}>
								<Text style={{ width: 1, height: 10, left: 10, backgroundColor: null, fontSize: 1 }}></Text>
							</TouchableHighlight>

							<View style={[styles.subModalView, { alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }]}>
								<Text style={[styles.textLabelText, { alignSelf: 'flex-end', fontSize: 23 }]}>{I18n.t('set_count_sublabel')}</Text>
							</View>
							<View style={[styles.subModalView, {
								height: height(18), alignItems: 'center', justifyContent: 'center'}]}>
								<TextInput
									style={[styles.subModalText, {
										width: 100, height: 50, textAlign: 'center',
										borderColor: styleVars.colors.buttonBorder, borderWidth: 1}]}
									keyboardType='numeric'
									onChangeText={(text) => this.onChange(text)}
									value={this.state.myNumber}
								/>
							</View>
							<View style={styles.subModalView}>
								<Button style={[styles.button, { width: width(100) - 124, borderRadius: 10, justifyContent: 'center' }]} 
								onPress={() => { this.setCountModalVisible(!this.state.countModalVisible) }}>
									<Text style={[styles.button1Text, {marginLeft: 20,
										fontSize: 24.5, textAlign: 'center', left: 0, color: styleVars.colors.white, width: width(100) - 146
									}]}>{I18n.t('perform_label')}</Text>
								</Button>
							</View>
						</View>

					</View>
				</Modal>

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
							<TouchableHighlight onPress={() => { this.quitSaveModalVisible(!this.state.saveModalVisible) }}
								underlayColor={styleVars.colors.primaryBackground}
								style={{
									position: 'absolute', width: 30, right: -15, top: -15, height: 30, borderRadius: 15,
									backgroundColor: styleVars.colors.buttonBackground, borderWidth: 1, borderColor: styleVars.colors.buttonBorder
								}}>
								<Text style={{ width: 1, height: 10, left: 10, backgroundColor: null, fontSize: 1 }}></Text>
							</TouchableHighlight>

							<View style={[styles.subModalView, { alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }]}>
								<Text style={[styles.textLabelText, { alignSelf: 'flex-end', fontSize: 23 }]}>{I18n.t('save_setting_label')}</Text>
							</View>
							<View style={[styles.subModalView, { height: height(18), alignItems: 'center', justifyContent: 'center' }]}>
								<TextInput
									style={[styles.subModalText, {
										width: 200, height: 50, textAlign: 'center',
										borderColor: styleVars.colors.buttonBorder, borderWidth: 1 }]}
									keyboardType='numeric'
									onChangeText={(text) => { this.setState({ settingName: text }); }}
									value={this.state.settingName}
								/>
							</View>
							<View style={styles.subModalView}>
								<Button style={[styles.button, { width: width(100) - 124, borderRadius: 10, justifyContent: 'center' }]}
									onPress={() => { this.setSaveModalVisible(!this.state.saveModalVisible) }}>
									<Text style = {[styles.button1Text, {
										marginLeft: 20,
										fontSize: 24.5, textAlign: 'center', left: 0, color: styleVars.colors.white, width: width(100) - 146
									}]}>{I18n.t('perform_label')}</Text>
								</Button>
							</View>
						</View>

					</View>
				</Modal>

				
			</Content>
			<AdMobBanner
				bannerSize="smartBannerPortrait"
				adUnitID={BANNER_UNIT_ID}
				testDeviceID="EMULATOR"
				didFailToReceiveAdWithError={this.bannerError} />
			<Footer>
				<FooterTab>
					<Button style={{ borderWidth: 1, borderRadius: 0, borderColor: styleVars.colors.buttonBorder}} onPress={() => this.onTimerButtonPressed()}><Icon name='ios-timer-outline' /><Text style={styles.headerLabelText}>{I18n.t('timer_label')}</Text></Button>
					<Button style={{ borderWidth: 1, borderLeftWidth: 0, borderRadius: 0, borderColor: styleVars.colors.buttonBorder }} onPress={() => this.onSavedSettingsButtonPressed()}><Icon name='ios-list' /><Text style={styles.headerLabelText}>{I18n.t('saved_setting_label')}</Text></Button>
				</FooterTab>
			</Footer>
		</Container>
	);
	}
};



const styles = StyleSheet.create({

	subView: {
		height: height(18),
		marginLeft: 20,
		margin: 10,
		marginBottom:5,
		flexDirection: 'column'
	},

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
		left: width(20),
		width: width(30),
		textAlign:'right',
		paddingRight: 20
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

export default Main;
