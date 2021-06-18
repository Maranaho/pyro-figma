import React,{ useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import './User.css'

const User = ()=>{
  const { me } = useContext(PyroStateContext)
  const { img_url,handle } = me
  return (
    <div className="User">
      <img src={img_url} width="30" alt={handle}/>
      <span>{handle}</span>
    </div>
  )
}
export default User
