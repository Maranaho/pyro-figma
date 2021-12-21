import React,{ useContext,useState } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import InputDimensions from '../InputDimensions'
import User from '../User'
import SignOut from '../SignOut'
import Dimensions from '../Dimensions'
import pyro from '../../assets/images/pyro_white.svg'
import './ProtoActions.css'

const ProtoActions = ()=>{
  const dispatch = useContext(PyroDispatchContext)
  const { userData,loading,figmaData,token,currentPageIDX,figmaFile,currentFrameID } = useContext(PyroStateContext)
  const [ pagesOpen,setPagesOpen ] = useState(false)
  const handlePageMenuClick = e =>{
    dispatch({type:'SET_CURRENT_PAGE_IDX',payload:Number(e.target.getAttribute('idx'))})
    setPagesOpen(false)
  }

  return (
    <nav className="ProtoActions">
      <section>
        <img src={pyro} height="27" alt="pyro"/>
      </section>
      {figmaData&&currentFrameID?
        (<section className="fileInfo">
          <h1>{figmaData.name} - {figmaData.children[currentPageIDX].name}</h1>
        </section>):
        <h1 className="faded">Proto name - Page name</h1>
        }
      <section className="actions">
        <button className="btn full"><span>Share</span></button>
        <Dimensions/>
        <InputDimensions/>
        {userData&&<User/>}
        <SignOut css="full"/>
    </section>
  </nav>
  )
}
export default ProtoActions
