import React,{ useContext,useEffect } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import Gradients from '../Gradients'
import SolidBG from '../SolidBG'
import FrameContent from '../FrameContent'
import './Frame.css'

const Frame = ()=>{

  const { figmaData,currentPageIDX,currentFrameIDX } = useContext(PyroStateContext)
  const currentPage = figmaData.document.children[currentPageIDX]

  const makeBackground = (bg,idx) => {
    const key = currentPage.children[currentFrameIDX].id+idx
    switch (bg.type) {

      case "GRADIENT_RADIAL":
        return (
            <Gradients
              isLinear={false}
              key={key}
              bg={bg}/>
          );break;

      case "GRADIENT_LINEAR":
        return (
            <Gradients
              isLinear={true}
              key={key}
              bg={bg}/>
          );break;

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
