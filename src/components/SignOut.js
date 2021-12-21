import firebase from 'firebase/app'
import 'firebase/auth'

const SignOut = ({css})=>{
  const auth = firebase.auth()
  return (
    <main className="SignOut">
      <button className={`btn ${css}`} onClick={()=>auth.signOut()} >Sign out</button>
    </main>
  )
}

export default SignOut
