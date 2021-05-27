import React,{ useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import './InputDimensions.css'

const InputDimensions = ()=>{
  const dispatch = useContext(PyroDispatchContext)
  const { protoWidth,protoHeight,minWidth,minHeight,smoov } = useContext(PyroStateContext)
  const setInputDimensions = (e,isWidth) =>{
    if(!isNaN(Number(e.target.value)))dispatch({type:isWidth?'SET_WIDTH':'SET_HEIGHT',payload:Number(e.target.value)})
  }
  const checkMax = (e,isWidth) =>{
    if(isWidth){
      if(Number(e.target.value)>window.innerWidth){
        dispatch({type:'SET_WIDTH',payload:window.innerWidth})
      }
      if(Number(e.target.value)<minWidth){
        dispatch({type:'SET_WIDTH',payload:minWidth})
      }
    } else {
      if(Number(e.target.value)>window.innerHeight){
        dispatch({type:'SET_HEIGHT',payload:window.innerHeight - 35})
      }
      if(Number(e.target.value)<minHeight){
        dispatch({type:isWidth?'SET_WIDTH':'SET_HEIGHT',payload:minHeight})
      }
    }
  }

  return (
    <div className="InputDimensions">
      <span>w</span>
      <input
        disabled={smoov}
        onFocus={e=>e.target.select()}
        onChange={e=>setInputDimensions(e,true)}
        onBlur={e=>checkMax(e,true)}
        value={Math.round(protoWidth)}
        type="text"/>
      <span>h</span>
      <input
        disabled={smoov}
        onFocus={e=>e.target.select()}
        onChange={e=>setInputDimensions(e,false)}
        onBlur={e=>checkMax(e,false)}
        value={Math.round(protoHeight)}
        type="text"/>
  </div>
  )
}
export default InputDimensions
