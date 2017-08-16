import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import { Button } from '../'
import Modal from 'react-native-modalbox'
import I18n from '../../i18n/i18n';

class CourseSelectPopup extends Component {

    constructor(props){
      super(props)

      this.close = this.close.bind(this)
    }

    componentDidMount() {
      if(this.props.isOpen == true) {
        this.refs.courseSelect.open()
      }
    }
    
    componentDidUpdate(prevProps, prevState) {
      if(this.props.isOpen == true) {
        this.refs.courseSelect.open()
      }
    }
    
    close() {
      const { onClose } = this.props
      this.refs.courseSelect.close()
      if(onClose) {
        onClose()
      }
    }

    render() {
        return (
          <Modal 
            style={[styles.modal]} 
            position={"center"} 
            ref={"courseSelect"}>
                
            <Text style={ styles.header }>CHOOSE the COURSE!</Text>
            <Text style={ styles.subtext }>{I18n.t('course_select')}</Text>
            
            <TouchableOpacity style={ styles.closeContainer } onPress={ () => { this.close() } }>  
              <Image
                source={ require('../../../assets/images/cross.png') }
                style={ styles.close }
              ></Image>
            </TouchableOpacity> 
            
            { this.props.children }
            
          </Modal>
        )
    }

}

const styles = StyleSheet.create({

  modal: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: styleVars.colors.modalBG
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
    fontSize: 24,
    fontWeight: "500",
    letterSpacing: 1,
    paddingTop: 30,
    paddingBottom: 10 
  },
  
  subtext: {
    fontSize: 15,
    letterSpacing: 0.6,
    color: styleVars.colors.fontLabel,
    paddingTop: 7,
    paddingBottom: 35
  },

  closeContainer: {
    position: 'absolute',    
    top: 0,
    right: 0,
    padding: 20
    },

  close: {
    height: 15,
    width: 15
  },

  buttonCont: {
    justifyContent: 'space-between',
    width: 200,
    height: 220,
    paddingTop: 18,
    paddingBottom: 18,
    alignItems: 'center',
    marginBottom: 80
  },
  
  button: {
    width: 200,
    height: 40,
  },

  buttonText: {
    fontFamily: styleVars.fonts.main,
    fontSize: 15,
  }
})

export { CourseSelectPopup }