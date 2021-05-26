import React,{ useContext,useEffect } from 'react'
import { Resizable } from 'react-resizable'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import Frame from '../Frame'
import Empty from '../Empty'
import './Frames.css'
import './../../resize.css'

const Frames = ()=>{

  const dispatch = useContext(PyroDispatchContext)
  const { figmaData,currentPageIDX,currentFrameIDX,isMobile,protoWidth,protoHeight,smoov } = useContext(PyroStateContext)

  const currentPage = figmaData.document.children[currentPageIDX]
  const handleResize = (e,{size}) =>{
    const { width,height } = size
    dispatch({type:'SET_WIDTH',payload:width})
    dispatch({type:'SET_HEIGHT',payload:height})
  }

  const protoStart =()=>{
    currentPage.children.every((frame,idx)=>{
      if(frame.id === currentPage.prototypeStartNodeID){
        dispatch({type:'SET_CURRENT_FRAME_IDX',payload:idx})
        return false
      } else return true
    })
  }

  useEffect(protoStart,[figmaData])
  return (
    <Resizable
      maxConstraints={[window.innerWidth, window.innerHeight - 34]}
      minConstraints={[375, 400]}
      onResize={handleResize}
      width={protoWidth}
      height={protoHeight}>
      <main
        style={{"width":protoWidth,"height":protoHeight}}
        className={`Frames box ${isMobile?'mobile':'desktop'} ${smoov?'smoov':''}`}>
        {currentPage.children.length? <Frame/>:<Empty/>}
      </main>
    </Resizable>
  )
}
export default Frames
