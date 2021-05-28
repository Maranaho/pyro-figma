import React,{ useRef,useEffect,useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import RenderedColor from '../../Utils/RenderedColor'
import './Gradients.css'

const Gradients = ({bg,gradType})=>{
  const { protoWidth,protoHeight,figmaData } = useContext(PyroStateContext)
  const canvasRef = useRef(null)
  const { blendMode,gradientHandlePositions,gradientStops } = bg

  const makeGradients =()=>{
    const startGradient = gradientHandlePositions[0]
    const endGradient = gradientHandlePositions[1]
    const c = canvasRef.current.getContext('2d')
    c.clearRect(0, 0, Math.round(protoWidth), protoHeight)

    const x0 = startGradient.x*Math.round(protoWidth)
    const y0 = startGradient.y*Math.round(protoHeight)
    const x1 = endGradient.x*Math.round(protoWidth)
    const y1 = endGradient.y*Math.round(protoHeight)
    const gradientWith = Math.sqrt(((x0-y0)*(x0-y0))+((x1-y1)*(x1-y1)))
    let grad
    switch (gradType) {
      case 'linear':grad = c.createLinearGradient(x0,y0,x1,y1);break;
      case 'radial':grad = c.createRadialGradient(x0,y0,0,x0,y0,gradientWith);break;
      default:grad = c.createLinearGradient(x0,y0,x1,y1);break;
    }

    gradientStops.forEach((stop,idx) => {
      const { position,color } = stop
      grad.addColorStop(position,RenderedColor(color))
    })
    c.fillStyle = grad
    c.fillRect(0,0,Math.round(protoWidth),Math.round(protoHeight))
  }

  const bgBlend = ()=> {
    return {
      opacity: bg.opacity,
      mixBlendMode: bg.blendMode.toLowerCase().split('_').join('-')
    }
  }



  useEffect(makeGradients,[figmaData,protoHeight,protoWidth])
  return (
    <div style={bgBlend()} className="Gradients">
      <canvas
        width={protoWidth}
        height={protoHeight}
        ref={canvasRef}/>
    </div>
  )
}
export default Gradients
