import React,{ useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import RenderElements from '../RenderElements'
import Background from '../Background'
import './Frame.css'

const Frame = ()=>{

  const { figmaData,currentPageIDX,currentFrameIDX } = useContext(PyroStateContext)
  const currentPage = figmaData.document.children[currentPageIDX]
  return (
    <section className="Frame">
      <Background element={currentPage.children[currentFrameIDX]}/>
      <RenderElements/>
    </section>
  )
}
export default Frame
