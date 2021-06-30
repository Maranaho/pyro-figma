import React,{ useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import RenderElements from '../RenderElements'
import Background from '../Background'
import Stroke from '../Stroke'
import './Frame.css'

const Frame = ()=>{
  const { figmaData,currentPageIDX,currentFrameIDX,protoHeight } = useContext(PyroStateContext)
  const currentPage = figmaData.document.children[currentPageIDX]
  const parentStyle = {
    //overflowY: protoHeight < currentPage.children[currentFrameIDX].absoluteBoundingBox.height ? "scroll":null
  }
  return (
    <section style={parentStyle} className="Frame">
      {(currentPage.children[currentFrameIDX].hasOwnProperty('background')&&currentPage.children[currentFrameIDX].background.length>0)&&<Background element={currentPage.children[currentFrameIDX]}/>}
      {(currentPage.children[currentFrameIDX].hasOwnProperty('strokes')&&currentPage.children[currentFrameIDX].strokes.length>0)&&<Stroke element={currentPage.children[currentFrameIDX]}/>}
      <RenderElements/>
    </section>
  )
}
export default Frame
