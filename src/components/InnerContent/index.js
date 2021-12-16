import React,{ useContext,useEffect } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import RenderNode from '../RenderNode'
import './InnerContent.css'

const InnerContent = ()=>{

  const dispatch = useContext(PyroDispatchContext)
  const { figmaData,currentPageIDX,currentFrameIDX,nodeTree } = useContext(PyroStateContext)
  const currentPage = figmaData.children[currentPageIDX]
  const currentFrame = currentPage.children[currentFrameIDX]

  const dispatchNodes = child =>{
    const { id,type,children,name } = child
    if(children)children.forEach(itm=>{
      const baby = {...itm}
      baby.parent = id
      dispatchNodes(baby)
    })
    if(!child.parent) child.parent = currentFrame.id
    if(child.id !== currentFrame.id)dispatch({type:'ADD_CHILD_ELEMENT',payload:child})
  }

  useEffect(()=>dispatchNodes(currentPage.children[currentFrameIDX]),[figmaData,currentFrameIDX])
  return (
    <section className="InnerContent">
      {nodeTree&&Object.keys(nodeTree).map(key=><RenderNode key={key} node={nodeTree[key]}/>)}
    </section>
  )
}
export default InnerContent
