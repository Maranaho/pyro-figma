import React,{ useContext,useEffect } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import './FrameContent.css'

const FrameContent = ()=>{

  const { figmaData,currentPageIDX,currentFrameIDX } = useContext(PyroStateContext)
  const currentPage = figmaData.document.children[currentPageIDX]

  const yo=()=>{
  }


  useEffect(yo,[currentFrameIDX])
  return (
    <section className="FrameContent">
      
    </section>
  )
}
export default FrameContent
