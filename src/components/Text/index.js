import React,{ useEffect,useState,useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import RenderedColor from '../../Utils/RenderedColor'
import ReturnVisibility from '../../Utils/ReturnVisibility'
import Background from '../Background'
import './Text.css'

const Text = ({handleClick,node,style:posStyle}) =>{
const {
  id,
  transitionNodeID,
  name,
  characters,
  textAlignHorizontal,
  textAlignVertical,
  textAutoResize,
  textCase,
  textDecoration,
  fontName,
  fontSize,
  layoutAlign,
  layoutGrow,
  letterSpacing,
  lineHeight,
  listSpacing
 } = node
const [ textStyles,setTextStyles ] = useState(null)
const txtStyles = {
  textAlign:textAlignHorizontal,
  textAlignVertical,
  textAutoResize,
  textTransform:textCase,
  textDecoration,
  fontStyle:fontName.style,
  fontFamily:fontName.family,
  fontSize,
  layoutAlign,
  layoutGrow,
  letterSpacing,
  lineHeight,
  listSpacing
}

const { pluginState } = useContext(PyroStateContext)

const getStyles = ()=>{
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
const sumStyles = ()=>{
  const temp = {...posStyle,...textStyles}
  if(pluginState.pluginConditions.hasOwnProperty(id)) {
    const showMe = Object.keys(pluginState.pluginConditions[id]).every(condition => {
      const isVisible = ReturnVisibility(pluginState,pluginState.pluginConditions[id][condition])
      if(isVisible) return true
      else return false
    })
    if(!showMe)temp.display = "none"
    else temp.display = "block"
  }
  delete temp.height
  return temp
}
useEffect(getStyles,[])
if(!pluginState)return null
const { pluginTexts,pluginVariables,pluginConditions } = pluginState
  return (
    <p
      onClick={handleClick}
      style={sumStyles()}
      className={`Text ${node.name.split(' ')[0]} ${transitionNodeID?'clickable':null}`}>
      {(pluginTexts&&pluginTexts.hasOwnProperty(id)&&pluginVariables[pluginTexts[id].varID]==='mt')?'':pluginTexts&&pluginTexts.hasOwnProperty(id)?String(pluginVariables[pluginTexts[id].varID]):characters}
    </p>
  )
}

export default Text
