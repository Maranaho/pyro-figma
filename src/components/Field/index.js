import React,{ useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import RenderedColor from '../../Utils/RenderedColor'
import Background from '../Background'
import './Field.css'

const Field = ({handleClick,node,style}) =>{
  const { transitionNodeID,name,id } = node
  const dispatch= useContext(PyroDispatchContext)
  const { pluginState } = useContext(PyroStateContext)
  const { pluginFields,pluginVariables } = pluginState
  const { placeHolder,type,varID } = pluginFields[id]

  return (
    <input
      className="Field"
      onFocus={e=>e.target.select()}
      onChange={e=>dispatch({type:'UPDATE_FIELD_VALUE',payload:{val:e.target.value,variable:varID}})}
      placeholder={placeHolder}
      type={type}
      value={pluginVariables[varID]==='mt'?'':pluginVariables[varID]}/>
  )
}

export default Field
