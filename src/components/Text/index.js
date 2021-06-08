import React, { useContext,useState,useEffect } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import RenderedColor from '../../Utils/RenderedColor'
import './Text.css'

const Text = ({ node,styles,flexChild })=>{
  const { figmaData,currentFrameIDX,currentPageIDX,protoWidth,protoHeight,nodeTree } = useContext(PyroStateContext)
  const { characters,style,parent } = node
  const [ textStyles,setTextStyles ] = useState(null)
  const txtStyles = {...style}
  const swapKeys = (oldKey,newKey)=>delete Object.assign(txtStyles, style, {[newKey]: style[oldKey] })[oldKey]

  const getStyles = ()=>{
    swapKeys("textAlignHorizontal","textAlign")
    swapKeys("textCase","textTransform")
    switch (txtStyles.textTransform) {
      case "UPPER":txtStyles.textTransform="uppercase";break;
      case "LOWER":txtStyles.textTransform="lowercase";break;
      case "TITLE":txtStyles.textTransform="capitalize";break;
      default: txtStyles.textTransform="normal";
    }
    delete txtStyles["textCase"]
    delete txtStyles["textAlignHorizontal"]
    txtStyles.color = RenderedColor(node.fills[0].color)
    if(flexChild){
      delete txtStyles["top"]
      delete txtStyles["right"]
      delete txtStyles["left"]
      delete txtStyles["bottom"]
    }
    setTextStyles(txtStyles)
  }
  useEffect(getStyles,[figmaData,currentFrameIDX])
  return (
    <p
      className={`Text ${flexChild?'flexChild':''}`}
      style={flexChild?{...textStyles}:{...styles,...textStyles}}>{characters}</p>
  )
}
export default Text
