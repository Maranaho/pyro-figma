import React from 'react'
import StrokeGradients from '../StrokeGradients'
import StrokeSolidBG from '../StrokeSolidBG'
import './Stroke.css'

const Stroke = ({ element })=>{
  const makeStroke = (str,idx) => {
    const key = element.id+idx
    if (!str.hasOwnProperty("visible")||str.visible) {
      switch (str.type) {

        case "GRADIENT_LINEAR":
          return (
              <StrokeGradients
                strokeWeight={element.strokeWeight}
                gradType="linear"
                key={key}
                str={str}/>
            );break;

        case "GRADIENT_RADIAL":
        case "GRADIENT_DIAMOND":
        case "GRADIENT_ANGULAR":
          return (
              <StrokeGradients
                strokeWeight={element.strokeWeight}
                gradType="radial"
                key={key}
                str={str}/>
            );break;

        default: return (
          <StrokeSolidBG
            strokeWeight={element.strokeWeight}
            element={element}
            str={str}
            key={key}/>
        )
      }
    }
    return null
  }
  if(element.strokes.length ===0)return null
  return (
    <section className="Stroke">
      {element.hasOwnProperty("strokes")&&element.strokes.map((str,idx)=>makeStroke(str,idx))}
    </section>
  )
}
export default Stroke
