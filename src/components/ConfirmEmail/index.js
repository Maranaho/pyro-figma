import React ,{ useContext,useState } from 'react'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import './ConfirmEmail.css'

const FIGMA_CLIENT_ID = process.env.REACT_APP_FIGMA_CLIENT_ID
const ConfirmEmail = ()=>{

  const dispatch = useContext(PyroDispatchContext)
  const auth = firebase.auth()
  const [user] = useAuthState(auth)
  // const { params } = useParams()
  // const decodedParams = atob(params)
  // const fileKey = decodedParams.split('**')[0]
  const [ cancel,setCancel ] = useState(false)
  const [ allowAccess,setAllowAccess ] = useState(false)
  const [ resetEmail,setResetEmail ] = useState(true)
  // const [ email,setEmail ] = useState(decodedParams.split('**')[1])
  // const [ tempEmail,setTempEmail ] = useState(decodedParams.split('**')[1])
  const testingUrl = "http://localhost:3000"
  const prodUrl = "https://maranaho.com"
  const actionUrl = "https://www.figma.com/oauth?client_id="+FIGMA_CLIENT_ID+"&redirect_uri="+testingUrl+"/figma/prototype&scope=file_read&state=pyro&response_type=code"
  // const handleSubmit = e=>{
  //   e.preventDefault()
  //   if(!cancel){
  //     setEmail(tempEmail)
  //     saveParams(tempEmail)
  //   }
  //   setResetEmail(true)
  //   setCancel(false)
  // }

  // const saveParams = email =>{
  //   window.localStorage.setItem('email',email)
  //   window.localStorage.setItem('fileKey',fileKey)
  // }

  const handleAllowClick = ()=>{
  //  dispatch({type:'SET_EMAIL',payload:email})
    dispatch({type:'SET_ONBARDING',payload:1})
  }

  return (
    <main className="ConfirmEmail">
      ConfirmEmail
    </main>
  )
}

export default ConfirmEmail
