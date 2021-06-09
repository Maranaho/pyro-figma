import React,{ useEffect,useState } from 'react'
import RenderedColor from '../../Utils/RenderedColor'
import Background from '../Background'
import './Text.css'

const Text = ({node,style:posStyle}) =>{
const { name,characters,style:fontStyle } = node
const [ textStyles,setTextStyles ] = useState(null)
const txtStyles = {...fontStyle}
const swapKeys = (oldKey,newKey)=>delete Object.assign(txtStyles, fontStyle, {[newKey]: fontStyle[oldKey] })[oldKey]

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
  delete txtStyles["lineHeightPercent"]
  delete txtStyles["lineHeightPx"]
  delete txtStyles["textAutoResize"]
  if(txtStyles.textAlignVertical !== "TOP"||txtStyles.textAlignHorizontal!=="LEFT"){
    txtStyles.display = "flex"
    let justif,align
    switch (txtStyles.textAlignHorizontal) {
      case "CENTER":justif = "center";break;
      case "RIGHT":justif = "flex-end";break;
    }
    switch (txtStyles.textAlignVertical) {
      case "CENTER":align = "center";break;
      case "BOTTOM":align = "flex-end";break;
    }
    txtStyles.justifyContent = justif
    txtStyles.alignItems = align
  }

  txtStyles.color = RenderedColor(node.fills[0].color)
  console.log({...posStyle,...textStyles});
  setTextStyles(txtStyles)
}
useEffect(getStyles,[])

  return (
    <p style={{...posStyle,...textStyles}} className={`Text ${node.name.split(' ').join('_')}`}>
      {characters}
    </p>
  )
}

export default Text
