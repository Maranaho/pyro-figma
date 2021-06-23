import React ,{ useContext,useState } from 'react'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import PyroStateContext from '../../context/PyroStateContext'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import './AllowAccess.css'

const AllowAccess = ()=>{
  const dispatch = useContext(PyroDispatchContext)
  const { email } = useContext(PyroStateContext)
  const auth = firebase.auth()
  const [user] = useAuthState(auth)
  const FIGMA_CLIENT_ID = process.env.REACT_APP_FIGMA_CLIENT_ID
  const testingUrl = "http://localhost:3000"
  const prodUrl = "https://maranaho.com"
  const actionUrl = "https://www.figma.com/oauth?client_id="+FIGMA_CLIENT_ID+"&redirect_uri="+testingUrl+"/figma/prototype&scope=file_read&state=pyro&response_type=code"

  return (
    <main className="AllowAccess">
      <h2>Well done!</h2>
      <p>You will no receive an email at <strong>{email}</strong></p>
      <p>Please validate the link to finish onboarding</p>
      <div className="btnCtn">
        <span onClick={()=>dispatch({type:'SET_ONBARDING',payload:0})} className="shallowLink">Back to change my email</span>
        <button onClick={()=>dispatch({type:'SET_ONBARDING',payload:2})}className="btn full"><a href={actionUrl}>Send it on</a></button>
      </div>
    </main>
  )
}

export default AllowAccess
