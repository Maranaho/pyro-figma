import { useReducer,useEffect } from 'react'
import { firestore } from '../../Utils/firebase'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import PyroReducer, { initialPyroState } from '../../reducers/PyroReducer'
import pyro from '../../assets/images/pyro_white.svg'
import useAuth from '../../hooks/useAuth'
import Login from '../Login'
import UserNotAllowed from '../UserNotAllowed'
import User from '../User'
import SignOut from '../SignOut'
import SignIn from '../SignIn'
import Pile from '../Pile'
import App from '../../App'

const InitFigma = ()=>{
  const user = useAuth()
  const fileKey = window.location.href.split('/figma/?key=')[1]
  const [ state, dispatch ] = useReducer(PyroReducer, initialPyroState)
  const { requestSent,userData,authData,userIsAllowed,figmaFile } = state
  const db = firestore.collection('figma-files').doc(fileKey)

  const updateUser = ()=>{
    if(user){
      const { photoURL,email,displayName } = user
      dispatch({type:'SET_USER',payload:{ photoURL,email,displayName }})
    } else dispatch({type:'SET_USER',payload:null})
  }

  const authorizeUser = ()=>{
    let isAuthorised = false
    if (user&&authData&&userData) {
      const { currentOrg,myEmail,orgDomain,useOrg,users } = authData
      const { displayName,email,photoURL } = userData
      const imTheOwner = myEmail===email
      const isMyGuest = users.length&&users.indexOf(email)!==-1
      const isInMyOrg = useOrg && email.indexOf(currentOrg)!== -1
      if (isInMyOrg) isAuthorised = true
      if(isMyGuest) isAuthorised = true
      if(imTheOwner)isAuthorised = true
    }
    return isAuthorised

  }

  const getData = () =>{
    db.get()
    .then(doc =>{
      if (doc.exists) {
        const {authData,pageData} = doc.data()
        dispatch({type:'UPDATE_FILE_DATA_FROM_FIGMA',payload:{authData,pageData}})
        dispatch({type:'SET_CURRENT_FRAME_ID',payload:pageData.children[0].prototypeStartNodeID})
      } else dispatch({type:'NO_PROTO'})
    }).catch(error => console.error(error))
    updateUser()
    authorizeUser()
  }


  useEffect(getData,[])
  useEffect(()=>{
    updateUser()
    if(userIsAllowed!==authorizeUser())dispatch({type:'AUTHORISE_USER',payload:authorizeUser})
  },[authorizeUser(),user])
  useEffect(()=>{
    dispatch({type:'SET_FILEKEY',payload:fileKey})
  },[])
  if(!figmaFile)return <p>no file</p>
  return (
    <PyroDispatchContext.Provider value={dispatch}>
      <PyroStateContext.Provider value={state}>
        {user&&authorizeUser()?<App/>:(
          <main className="SignIn">
            <section>
              <img src={pyro} height="27" alt="pyro"/>
              {userData&&<User/>}
            </section>
            {user&&!authorizeUser()?<UserNotAllowed/>:<Login/>}
            {requestSent&&<Pile msg="Request sent succesfully"/>}
            <small>*Better design coming up!</small>
          </main>
        )}

      </PyroStateContext.Provider>
    </PyroDispatchContext.Provider>
  )
}

export default InitFigma
