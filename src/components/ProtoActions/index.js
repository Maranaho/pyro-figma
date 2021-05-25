import React,{ useContext,useEffect } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import GetFileFromToken from '../../Utils/GetFileFromToken'
import './ProtoActions.css'

const ProtoActions = ()=>{
  const dispatch = useContext(PyroDispatchContext)
  const { loading,figmaData,token } = useContext(PyroStateContext)
  useEffect(()=>{
    if(figmaData)console.log(figmaData);
  },[figmaData])
  return (
    <main className="ProtoActions">
      {figmaData&&<h1>{figmaData.name}</h1>}
      <button disabled={loading} onClick={()=>GetFileFromToken(token,dispatch)}>
        <i className="hi hi-refresh"/>
        {false&&<span>{loading?'Loading...':'Refresh data'}</span>}
      </button>
    </main>
  )
}
export default ProtoActions
