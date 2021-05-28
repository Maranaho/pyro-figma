import React,{ useEffect,useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import './ImageBG.css'

const ImageBG = ({bg})=>{
  const { fileImages,protoWidth,protoHeight,smoov } = useContext(PyroStateContext)
  const fill = ()=>{
    //@TO
    if(protoWidth < protoHeight) return {height:protoHeight}
    return {height:protoWidth}
  }
  const tile = ()=>{
    if(fileImages) return {...bgBlend(),backgroundImage:"url("+fileImages[bg.imageRef]+")"}
    return null
  }

  const bgBlend = ()=> {
    return {
      opacity: bg.opacity,
      mixBlendMode: bg.blendMode.toLowerCase().split('_').join('-')
    }
  }

  if(!fileImages)return null
  return (
    <div
      style={bg.scaleMode==='TILE'?tile():bgBlend()}
      className={`ImageBG ${bg.scaleMode.toLowerCase()} ${protoWidth<protoHeight?'portrait':'landscape'} ${smoov?'smoov':''}`}>
      {bg.scaleMode!=='TILE'&&<img src={fileImages[bg.imageRef]} style={bg.scaleMode === 'FILL'?fill():null}alt="protoBg"/>}
    </div>
  )
}
export default ImageBG
