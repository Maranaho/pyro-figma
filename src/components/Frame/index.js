import React,{ useContext,useEffect } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import './Frame.css'

const Frame = ()=>{

  const { figmaData,currentPageIDX,currentFrameIDX } = useContext(PyroStateContext)
  const currentPage = figmaData.document.children[currentPageIDX]

  const yo=()=>{
    console.log('yo');
  }


  useEffect(yo,[figmaData])
  return (
    <section className="Frame">
        <p>{currentPage.children[currentFrameIDX].name}</p>
    </section>
  )
}
export default Frame
