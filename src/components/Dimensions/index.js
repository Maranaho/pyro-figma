import React,{ useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import mobile from '../../assets/images/mobile.svg'
import desktop from '../../assets/images/desktop.svg'
import './Dimensions.css'

const Dimensions = ()=>{
  const dispatch = useContext(PyroDispatchContext)
  const { protoWidth,protoHeight,smoov } = useContext(PyroStateContext)
  const setDimensions = desk =>{
    dispatch({type:desk?'SET_DESKTOP':'SET_MOBILE'})
    setTimeout(()=>dispatch({type:'REMOVE_SMOOV'}),1000)
  }
  return (
    <div className="Dimensions">
      <button
        disabled={smoov}
        onClick={()=>setDimensions(false)}
        className={protoWidth <= 450 ?'active':null}>
        <img src={mobile} alt="mobile"/>
      </button>
      <button
        disabled={smoov}
        onClick={()=>setDimensions(true)}
        className={protoWidth > 450 ?'active':null}>
        <img src={desktop} alt="desktop"/>
      </button>
  </div>
  )
}
export default Dimensions
