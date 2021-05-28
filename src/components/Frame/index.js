import React,{ useContext,useEffect } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import Gradients from '../Gradients'
import SolidBG from '../SolidBG'
import ImageBG from '../ImageBG'
import FrameContent from '../FrameContent'
import './Frame.css'

const Frame = ()=>{

  const { figmaData,currentPageIDX,currentFrameIDX } = useContext(PyroStateContext)
  const currentPage = figmaData.document.children[currentPageIDX]

  const makeBackground = (bg,idx) => {
    const key = currentPage.children[currentFrameIDX].id+idx
    switch (bg.type) {

      case "GRADIENT_LINEAR":
        return (
            <Gradients
              gradType="linear"
              key={key}
              bg={bg}/>
          );break;

      case "GRADIENT_RADIAL":
      case "GRADIENT_DIAMOND":
      case "GRADIENT_ANGULAR":
        return (
            <Gradients
              gradType="radial"
              key={key}
              bg={bg}/>
          );break;

      case "IMAGE": return <ImageBG bg={bg} key={key}/>;break;
      case "SOLID": return <SolidBG bg={bg} key={key}/>;break;

      default: return <SolidBG bg={bg} key={key}/>
    }
  }

  return (
    <section className="Frame">
      {currentPage
        .children[currentFrameIDX]
        .background.map((bg,idx)=>makeBackground(bg,idx))}
      <FrameContent/>
    </section>
  )
}
export default Frame
