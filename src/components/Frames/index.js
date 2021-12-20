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
  const { currentBreakpoint,breakPoints,nodeTree,figmaData,currentPageIDX,currentFrameID,isMobile,protoWidth,protoHeight,smoov,minWidth, minHeight } = useContext(PyroStateContext)
  const currentPage = figmaData.children[currentPageIDX]
  const handleResize = (e,{size}) =>{
    const { width,height } = size
    dispatch({type:'SET_DIRECTION',payload:0>=protoWidth-width})
    dispatch({type:'SET_WIDTH',payload:width})
    dispatch({type:'SET_HEIGHT',payload:height})
  }


  const checkRWD = ()=>{
    const pages = figmaData.children[currentPageIDX]
    if(pages.hasOwnProperty('children')){
      Object.keys(pages.children).forEach((key,idx) => {
        const frame = pages.children[key]
        if (frame.name.indexOf('|')!==-1) {
          frame[frame.name.split('|')[0].split(' ').join('**').toLowerCase()] = frame.absoluteBoundingBox.width
          frame.index = idx
        }
      })
    }
  }

  const updateBreakPoint = () =>{
    if(breakPoints&&breakPoints.length){
      const currentId = breakPoints.indexOf(breakPoints[currentBreakpoint])
      if(currentFrameID!==currentId){
        dispatch({type:'SET_CURRENT_FRAME_ID',payload:breakPoints[currentBreakpoint].id})
        dispatch({type:'SET_CURRENT_FRAME_IDX',payload:currentId})
      }
    }
  }

  useEffect(updateBreakPoint,[currentBreakpoint,breakPoints])

  useEffect(checkRWD,[figmaData,currentPageIDX])
  if(!figmaData.children[currentPageIDX].hasOwnProperty('children'))return <Empty/>
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
        <p className="pageName">{currentPage.name} &nbsp;>&nbsp; {currentFrameID&&currentPage.children[currentFrameID].name}</p>
        <Frame/>
      </main>
    </Resizable>
  )
}
export default Frames
