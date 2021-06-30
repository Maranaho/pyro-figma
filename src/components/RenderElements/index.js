import React,{ useContext,useEffect } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import Empty from '../Empty'
import Element from '../Element'
import './RenderElements.css'

const RenderElements = ()=>{

  const dispatch = useContext(PyroDispatchContext)
  const { figmaData,currentPageIDX,currentFrameIDX,nodeTree,currentPageID } = useContext(PyroStateContext)
  const currentPage = figmaData.document.children[currentPageIDX]
  const currentFrame = currentPage.children[currentFrameIDX]
  const parentStyle = {
    //minHeight:currentPage.children[currentFrameIDX].absoluteBoundingBox.height
  }
  useEffect(()=>dispatch({type:'ADD_CHILD_ELEMENT',payload:currentFrame}),[])
  return (
    <section style={parentStyle} className="RenderElements">
      {currentFrame.hasOwnProperty('children')?currentFrame.children.map(child=>(
        <Element
          key={child.id}
          parent={currentFrame.id}
          node={child}/>
      )):<Empty/>}
    </section>
  )
}
export default RenderElements
