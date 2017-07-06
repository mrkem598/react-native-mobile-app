import firebase from 'firebase'
import MobxFirebaseStore from 'mobx-firebase-store'
const config = {
    apiKey: "AIzaSyBBGwukvGnbh6nlFeSO3OUfC1Ld1L-Sxuk",
    authDomain: "dinder-405ce.firebaseapp.com",
    databaseURL: "https://dinder-405ce.firebaseio.com",
    projectId: "dinder-405ce",
    storageBucket: "dinder-405ce.appspot.com",
    messagingSenderId: "639001304972"
  }
export default class SettingsStore extends MobxFirebaseStore {
  constructor() {
    firebase.initializeApp(config)
    super(firebase.database().ref())

    this.splashTime = 1000
    this.splashImg = require('../../images/splash.jpg')
    this.loginBG = require('../../images/login.jpg')
  }
  get LoginBG() {
    return this.loginBG
  }
  get SplashTime() {
    return this.splashTime
  }
  get SplashImg() {
    return this.splashImg
  }
}
