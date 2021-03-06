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
  const { currentBreakpoint,breakPoints,nodeTree,figmaData,currentPageIDX,currentFrameIDX,isMobile,protoWidth,protoHeight,smoov,minWidth, minHeight } = useContext(PyroStateContext)
  const currentPage = figmaData.document.children[currentPageIDX]
  const handleResize = (e,{size}) =>{
    const { width,height } = size
    dispatch({type:'SET_DIRECTION',payload:0>=protoWidth-width})
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

  const checkRWD = ()=>{
    const pages = figmaData.document.children[currentPageIDX]
    if(pages.hasOwnProperty('children')){
      pages.children.forEach((frame,idx) => {
        if (frame.name.indexOf('|')!==-1) {
          frame[frame.name.split('|')[0].split(' ').join('**').toLowerCase()] = frame.absoluteBoundingBox.width
          frame.index = idx
        }
      })
    }
  }


    useEffect(()=>{
      if(breakPoints&&breakPoints.length){
        const currentIdx = breakPoints[currentBreakpoint].index
        if(currentFrameIDX!==currentIdx)dispatch({type:'SET_CURRENT_FRAME_IDX',payload:currentIdx})
      }
    },[currentBreakpoint,breakPoints])


  useEffect(checkRWD,[figmaData,currentPageIDX])
  useEffect(protoStart,[figmaData])
  if(!figmaData.document.children[currentPageIDX].children.length)return <Empty/>
  return (
    <Resizable
      maxConstraints={[window.innerWidth, window.innerHeight - 34]}
      minConstraints={[minWidth, minHeight]}
      onResize={handleResize}
      width={protoWidth}
      height={protoHeight}>
      <main
        style={{"width":protoWidth,"height":protoHeight}}
        className={`Frames box ${isMobile?'mobile':'desktop'} ${smoov?'smoov':''}`}>
        <p className="pageName">{currentPage.name} &nbsp;>&nbsp; {currentPage.children[currentFrameIDX].name}</p>
        <Frame/>
      </main>
    </Resizable>
  )
}
export default Frames
