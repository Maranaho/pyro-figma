import { useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'

import SignOut from '../SignOut'
import './UserNotAllowed.css'

const UserNotAllowed = ()=>{
const dispatch = useContext(PyroDispatchContext)
const { userData } = useContext(PyroStateContext)
const sendRequest= ()=>{
  console.log('sendRequest');
}
const handleRequest = ()=>{
  sendRequest()
  dispatch({type:'SHOW_REQUEST'})
}
if(!userData)return null
const { displayName,email } = userData
  return (
    <main className="UserNotAllowed">
      <section>
        <h1>Sorry,<br/>you're not on <br/>the list 😞</h1>
        <p>You are logged in as <strong>{displayName}</strong></p>
        <p>With the email <strong>{email}</strong></p>
        <div className="btnCtn">
          <SignOut css="ghost"/>
          <button onClick={handleRequest} className="btn full">Request access</button>
        </div>
      </section>
    </main>
  )
}
export default UserNotAllowed
