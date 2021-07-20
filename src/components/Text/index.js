import React,{ useEffect,useState,useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import RenderedColor from '../../Utils/RenderedColor'
import Background from '../Background'
import './Text.css'

const Text = ({handleClick,node,style:posStyle}) =>{
const { id,transitionNodeID,name,characters,style:fontStyle } = node
const [ textStyles,setTextStyles ] = useState(null)
const txtStyles = {...fontStyle}
const swapKeys = (oldKey,newKey)=>delete Object.assign(txtStyles, fontStyle, {[newKey]: fontStyle[oldKey] })[oldKey]

const { pluginState } = useContext(PyroStateContext)
const { pluginTexts,pluginVariables } = pluginState

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
      case "CENTER":
        justif = "center"
        txtStyles.margin = "auto";
      break;
      case "RIGHT":justif = "flex-end";break;
    }
    switch (txtStyles.textAlignVertical) {
      case "CENTER":
        align = "center";
        txtStyles.margin = "auto";
      break;
      case "BOTTOM":align = "flex-end";break;
    }
    txtStyles.justifyContent = justif
    txtStyles.alignItems = align
  }

  txtStyles.color = RenderedColor(node.fills[0].color)
  setTextStyles(txtStyles)
}
useEffect(getStyles,[])


  return (
    <p
      onClick={handleClick}
      style={{...posStyle,...textStyles}}
      className={`Text ${node.name.split(' ').join('_')} ${transitionNodeID?'clickable':null}`}>
      {(pluginTexts&&pluginTexts.hasOwnProperty(id)&&pluginVariables[pluginTexts[id].varID]==='mt')?'':pluginTexts&&pluginTexts.hasOwnProperty(id)?String(pluginVariables[pluginTexts[id].varID]):characters}
    </p>
  )
}

export default Text
