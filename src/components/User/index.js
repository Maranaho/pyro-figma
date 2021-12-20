import React,{ useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import './User.css'

const User = ()=>{
  const { userData } = useContext(PyroStateContext)
  const { displayName,email,photoURL} = userData

  return (
    <div className="User">
      {photoURL&&<img src={photoURL} width="30" alt={displayName}/>}
      <span>{displayName}</span>
    </div>
  )
}
export default User
