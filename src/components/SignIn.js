import firebase from 'firebase/app'
import 'firebase/auth'

const SignIn = ()=>{
  const auth = firebase.auth()

  const signInWithGoogle=()=>{
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }
  return (
    <main className="SignIn">
      <button className="btn full" onClick={signInWithGoogle}>Sign in</button>
    </main>
  )
}

export default SignIn
