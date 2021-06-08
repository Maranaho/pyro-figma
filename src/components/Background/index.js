import React from 'react'
import Gradients from '../Gradients'
import SolidBG from '../SolidBG'
import ImageBG from '../ImageBG'
import './Background.css'

const Background = ({ element })=>{

  const makeBackground = (bg,idx) => {
    const key = element.id+idx
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
  if(!element.hasOwnProperty("background")&&!element.hasOwnProperty("fills"))return null
  return (
    <section className="Background">
      {element.hasOwnProperty("background")&&element.background.map((bg,idx)=>makeBackground(bg,idx))}
      {element.hasOwnProperty("fills")&&element.fills.map((bg,idx)=>makeBackground(bg,idx))}
    </section>
  )
}
export default Background
