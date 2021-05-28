import React,{ useEffect } from 'react'
import RenderedColor from '../../Utils/RenderedColor'
import './SolidBG.css'

const SolidBG = ({bg})=>{
  const sldBg = ()=>{
    return {
      background:RenderedColor(bg.color),
      opacity: bg.opacity,
      mixBlendMode: bg.blendMode.toLowerCase().split('_').join('-')
    }
  }
  return (
    <div
      className="SolidBG"
      style={sldBg()}/>
  )
}
export default SolidBG
