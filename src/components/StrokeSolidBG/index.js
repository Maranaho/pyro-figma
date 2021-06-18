import React from 'react'
import RenderedColor from '../../Utils/RenderedColor'
import './StrokeSolidBG.css'

const StrokeSolidBG = ({element,str,strokeWeight})=>{

  const radius = ()=>{
    if(element.hasOwnProperty("rectangleCornerRadii")){
      return element.rectangleCornerRadii.reduce((acc,itm,idx)=>{
        acc = acc + itm+"px "
        return acc
      },"")
    } else return null
  }

  const sldBg = ()=>{
    return {
      borderRadius:radius(),
      border: strokeWeight +"px solid " + RenderedColor(str.color),
      opacity: str.opacity,
      mixBlendMode: str.blendMode.toLowerCase().split('_').join('-')
    }
  }
  return <div className="StrokeSolidBG" style={sldBg()}/>
}
export default StrokeSolidBG
