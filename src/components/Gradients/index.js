import React,{ useRef,useEffect,useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import './Gradients.css'

const Gradients = ({bg,isLinear})=>{
  const { protoWidth,protoHeight,figmaData } = useContext(PyroStateContext)
  const canvasRef = useRef(null)
  const { blendMode,gradientHandlePositions,gradientStops } = bg

  const renderColor = channel =>{
    if (channel!== 0 && channel!== 1) return channel*255
    else if(channel === 1) return 255
    else return channel
  }

  const makeGradients =()=>{
    console.clear()
    const startGradient = gradientHandlePositions[0]
    const endGradient = gradientHandlePositions[1]
    const widthGradient = gradientHandlePositions[2]
    const c = canvasRef.current.getContext('2d')
    console.log({startGradient,endGradient,widthGradient});
    c.clearRect(0, 0, Math.round(protoWidth), protoHeight)
    const x0 = startGradient.x*Math.round(protoWidth)
    const y0 = startGradient.y*Math.round(protoHeight)
    const x1 = endGradient.x*Math.round(protoWidth)
    const y1 = endGradient.y*Math.round(protoHeight)
    //console.log({x0,y0,x1,y1});
    let grad
    if (isLinear) grad = c.createLinearGradient(x0,y0,x1,y1)
    else grad = c.createRadialGradient(x0,y0,Math.round(protoWidth),x1,y1,Math.round(protoHeight)/2)
    gradientStops.forEach(stop => {
      const { position,color } = stop
      const { r,g,b,a } = color
      const renderedColor = 'rgba('+renderColor(r)+','+renderColor(g)+','+renderColor(b)+','+renderColor(a)+')'
      grad.addColorStop(position,renderedColor)
    })
    c.fillStyle = grad
    c.fillRect(0,0,Math.round(protoWidth),Math.round(protoHeight))
    //console.log(bg);
  }



  useEffect(makeGradients,[figmaData,protoHeight,protoWidth])
  return (
    <div className="Gradients">
      <canvas
        width={protoWidth}
        height={protoHeight}
        ref={canvasRef}/>
    </div>
  )
}
export default Gradients
