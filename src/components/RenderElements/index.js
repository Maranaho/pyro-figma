import React,{ useContext,useEffect } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import Element from '../Element'
import './RenderElements.css'

const RenderElements = ()=>{

  const dispatch = useContext(PyroDispatchContext)
  const { figmaData,currentPageIDX,currentFrameIDX,nodeTree } = useContext(PyroStateContext)
  const currentPage = figmaData.document.children[currentPageIDX]
  const currentFrame = currentPage.children[currentFrameIDX]
  useEffect(()=>dispatch({type:'ADD_CHILD_ELEMENT',payload:currentFrame}),[])
  return (
    <section className="RenderElements">
      {currentFrame.children.map(child=>(
        <Element
          key={child.id}
          parent={currentFrame.id}
          node={child}/>
      ))}
    </section>
  )
}
export default RenderElements
