import React,{ useContext,useEffect } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import Empty from '../Empty'
import Element from '../Element'
import './RenderElements.css'

const RenderElements = ()=>{

  const dispatch = useContext(PyroDispatchContext)
  const { figmaData,currentPageIDX,currentFrameID,nodeTree,currentPageID } = useContext(PyroStateContext)
  const currentPage = figmaData.children[currentPageIDX]
  const currentFrame = currentPage.children[currentFrameID]
  const parentStyle = {
    //minHeight:currentPage.children[currentFrameID].absoluteBoundingBox.height
  }



  useEffect(()=>{
    if(currentFrameID)dispatch({type:'ADD_CHILD_ELEMENT',payload:currentFrame})
  },[currentFrameID])
  if(!currentFrame)return null
  return (
    <section style={parentStyle} className="RenderElements">
      {currentFrame.hasOwnProperty('children')?Object.keys(currentFrame.children).map(key=>(
        <Element
          key={currentFrame.children[key].id}
          parent={currentFrame.id}
          node={currentFrame.children[key]}/>
      )):<Empty/>}
    </section>
  )
}
export default RenderElements
