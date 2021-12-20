import { useState,useEffect } from 'react'
import firebase from '../Utils/firebase'

const useAuth = ()=>{
  const [user,setUser] = useState(null)

  const listenToAuthState = ()=>
    firebase.auth()
      .onAuthStateChanged(user=>setUser(user))

  useEffect(listenToAuthState,[])

  return user
}

export default useAuth
