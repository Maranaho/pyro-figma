const FIREBASE_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY
const FIREBASE_APP_ID = process.env.REACT_APP_FIREBASE_APP_ID

const FireBaseInit = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "pyro-intuit.firebaseapp.com",
  databaseURL: "https://pyro-intuit.firebaseio.com",
  projectId: "pyro-intuit",
  storageBucket: "pyro-intuit.appspot.com",
  messagingSenderId: "657829873421",
  appId: FIREBASE_APP_ID
}
export default FireBaseInit
