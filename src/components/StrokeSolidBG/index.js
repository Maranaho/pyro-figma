import React from 'react'
import RenderedColor from '../../Utils/RenderedColor'
import './StrokeSolidBG.css'

const StrokeSolidBG = ({element,str,strokeWeight})=>{

  const radius = ()=>{
    if(element.hasOwnProperty("rectangleCornerRadius")){
      return element.rectangleCornerRadius.reduce((acc,itm,idx)=>{
        acc = acc + itm+"px "
        return acc
      },"")
    } else if(element.hasOwnProperty('cornerRadius')){
      return element.cornerRadius + 'px'
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
