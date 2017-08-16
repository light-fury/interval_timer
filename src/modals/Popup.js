import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modalbox'
import I18n from '../../i18n/i18n';

class Popup extends Component {

    constructor(props){
      super(props)

      this.close = this.close.bind(this)
      this.onClose = this.onClose.bind(this)
      this.onOpen = this.onOpen.bind(this)
    }

    componentDidMount() {
      if(this.props.isOpen == true) {
        this.refs.modal.open()
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if(this.props.isOpen == true) {
        this.refs.modal.open()
      }
    }
    
    close() {
      this.refs.modal.close()
    }

    onClose() {
      const { onClose } = this.props
      if(onClose) {
        onClose()
      }
    }
    
    onOpen() {
      const { onOpen } = this.props
      if(onOpen) {
        onOpen()
      }      
    }

    confirm() {
      const { onConfirm } = this.props
      this.close()
      if(onConfirm) {
        onConfirm()
      } 
    }
    
    renderHeader() {
      let { header } = this.props
      if(header) { 
        return <Text style={ styles.header }>{ header }</Text>
      }
    }

    render() {
        let { background, height, buttonLabel } = this.props
        height = height || 420
        buttonLabel = buttonLabel || I18n.t('confirm_message')
        return (
          <Modal 
            style={[styles.modal, { height: height } ]} 
            position={"center"} 
            onClosed={this.onClose}
            onOpened={this.onOpen}
            ref={"modal"}>
            <Image 
              source={ background }
              // resizeMode="contain"
              resizeMode='stretch'
              style={styles.container}>  

              { this.renderHeader() }
              
              <TouchableOpacity style={ styles.closeContainer } onPress={ () => { this.close() } }>  
                <Image
                  source={ require('../../../assets/images/cross.png') }
                  style={ styles.close }
                ></Image>
              </TouchableOpacity> 
              <View>
                { this.props.children }
              </View>
              <TouchableOpacity 
                style={ styles.button }
                onPress={ () => { this.confirm() } }
              >
                <Text style={ styles.buttonText } > {buttonLabel} </Text>
              </TouchableOpacity>
            </Image>
          </Modal>
        )
    }

}

const styles = StyleSheet.create({

  modal: {
    width: 270,
    justifyContent: 'center',
    alignItems: 'center',
    height: 390,
    backgroundColor:'transparent'
  },

  container: {
    width: '100%',
    height: '100%',
    flexWrap: 'wrap',
    backgroundColor:'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },

  header: {
    fontFamily: styleVars.fonts.main,    
    color: styleVars.colors.highlight,
    fontSize: 21,
    letterSpacing: 0.6,
    paddingTop: 23,
    paddingBottom: 5 
  },

  closeContainer: {
    position: 'absolute',    
    top: 0,
    right: 0,
    padding: 10
  },

  close: {
    height: 15,
    width: 15
  },

  button: {
    height: 40,
    position: 'absolute',
    bottom: 0,
    paddingTop: 8,
    paddingBottom: 15,
    paddingRight: 40,
    paddingLeft: 40,
  },

  buttonText: {
    fontFamily: styleVars.fonts.main,
    fontSize: 17,
    color: '#fff'
  }
})

export { Popup }