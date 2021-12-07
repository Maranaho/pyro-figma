import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const FireBaseInit = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "pyro-intuit.firebaseapp.com",
  databaseURL: "https://pyro-intuit.firebaseio.com",
  projectId: "pyro-intuit",
  storageBucket: "pyro-intuit.appspot.com",
  messagingSenderId: "657829873421",
  appId: process.env.REACT_APP_FIREBASE_APP_ID
}


firebase.initializeApp(FireBaseInit)
const auth = firebase.auth()
const firestore = firebase.firestore()
export { firestore,auth }

export default firebase
