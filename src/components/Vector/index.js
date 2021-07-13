import React,{ useContext,useEffect,useState } from 'react'
import RenderedColor from '../../Utils/RenderedColor'
import PyroStateContext from '../../context/PyroStateContext'
import Background from '../Background'
import Stroke from '../Stroke'
import './Vector.css'

const Vector = ({handleClick,node,style}) =>{
const { vectors } = useContext(PyroStateContext)
const { transitionNodeID,name,id,strokeWeight } = node
const {vectorPaths,width,height} = vectors[id]
const [vectorStyle,setVectorStyle] = useState({...style})
const [SVGStyle,setSVGStyle] = useState(null)
const [pathStyle,setPathStyle] = useState(null)

const setVector = ()=>{
  let tempStyle = {...vectorStyle}
  tempStyle.width = width
  tempStyle.height = height
  tempStyle["WebkitClipPath"] = "url(#"+id+")"
  setVectorStyle(tempStyle)
  let tempSVG = {}
  tempSVG.width = width
  tempSVG.height = height
  setSVGStyle(tempSVG)
  let path = {}
  path.stroke = width
  path.strokeWidth = strokeWeight*2
  if(node.strokes.length)path.stroke = RenderedColor(node.strokes[0].color)
  setPathStyle(path)
}
useEffect(setVector,[])
  return (
    <article
      onClick={handleClick}
      className={`Vector ${transitionNodeID?'clickable':null}`}
      style={vectorStyle}>
      <Background element={node}/>
      <svg
        style={SVGStyle}
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}>
        <path strokeLinecap="round" style={pathStyle} d={vectorPaths}/>
      </svg>
      <svg
        style={SVGStyle}
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <clipPath id={id} >
              <path d={vectorPaths}/>
            </clipPath>
         </defs>
      </svg>
    </article>
  )
}

export default Vector
