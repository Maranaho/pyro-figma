import React,{ useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import RenderedColor from '../../Utils/RenderedColor'
import RenderElements from '../RenderElements'
import Background from '../Background'
import Stroke from '../Stroke'
import './Frame.css'

const Frame = ()=>{
  const { figmaData,currentPageIDX,currentFrameID,protoHeight } = useContext(PyroStateContext)
  const currentPage = figmaData.children[currentPageIDX]
  const parentStyle = {
    //overflowY: protoHeight < currentPage.children[currentFrameID].absoluteBoundingBox.height ? "scroll":null
  }

  return (
    <section style={parentStyle} className="Frame">
      {(currentPage.children.hasOwnProperty(currentFrameID)&&currentPage.children[currentFrameID].hasOwnProperty('background')&&currentPage.children[currentFrameID].background.length>0)&&<Background element={currentPage.children[currentFrameID]}/>}
      {(currentPage.children.hasOwnProperty(currentFrameID)&&currentPage.children[currentFrameID].hasOwnProperty('strokes')&&currentPage.children[currentFrameID].strokes.length>0)&&<Stroke element={currentPage.children[currentFrameID]}/>}
      <RenderElements/>
    </section>
  )
}
export default Frame
