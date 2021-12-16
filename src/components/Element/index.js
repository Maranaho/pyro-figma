import React,{ useContext,useEffect,useState } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import RenderedColor from '../../Utils/RenderedColor'
import ReturnVisibility from '../../Utils/ReturnVisibility'
import Background from '../Background'
import Stroke from '../Stroke'
import Vector from '../Vector'
import Text from '../Text'
import Field from '../Field'
import Ellipse from '../Ellipse'
import './Element.css'

const Element = ({node,parent}) =>{
  const dispatch = useContext(PyroDispatchContext)
  const { updateVis,pluginState,pluginStateChanges,rotations,vectors,figmaData,currentFrameID,nodeTree,protoWidth,protoHeight,currentPageIDX } = useContext(PyroStateContext)

  const currentPage = figmaData.children[currentPageIDX]
  const currentFrame = currentPage.children[currentFrameID]
  const { transitionNodeID,opacity,effects,visible,constraints,type,id,name,absoluteBoundingBox,layoutMode,reactions } = node
  const [ parentNode,setParentNode ] = useState(currentFrame)
  const [ nodeStyle,setNodeStyle ] = useState(null)
  const [ flexChild,setFlexChild ] = useState(false)
  const [ clickable,makeClickable ] = useState(false)
  const flexParent = node.hasOwnProperty("layoutMode")
  let tempStyle = {}

  const setDimension =()=>{
    const { width,height } = absoluteBoundingBox
    if(constraints){
      switch (constraints.horizontal) {
        case "CENTER":case "MIN":case "MAX":
          if(node.layoutAlign!=='STRETCH')tempStyle.width = width;
        break;
      }
      switch (constraints.vertical) {
        case "CENTER":case "MIN":case "MAX":
          if(node.layoutGrow!== 1)tempStyle.height = height
          else tempStyle.height = "100%";
        break;
      }
    } else {
      tempStyle.width = width
      tempStyle.height = height
    }
  }

  const setOpacity =()=> tempStyle.opacity = opacity.toFixed(2)
  const setAxis= priority =>{
    let axis = null
    if (priority !== undefined) {
      switch (priority) {
        case "SPACE_AROUND":axis = "space-around";break;
        case "SPACE_BETWEEN":axis = "space-between";break;
        case "FIXED":axis = "flex-start";break;
        case "CENTER":axis = "center";break;
        case "MAX":axis = "flex-end";break;
        default: axis = "flex-start"
      }
    }
    return axis
  }


  const setFlex =()=>{
    const { primaryAxisAlignItems,counterAxisAlignItems } = node
    tempStyle.display = "flex"
    if(layoutMode === 'VERTICAL')tempStyle.flexDirection = 'column'
    tempStyle.justifyContent = setAxis(primaryAxisAlignItems)
    tempStyle.alignItems = setAxis(counterAxisAlignItems)
    const { paddingTop,paddingRight,paddingBottom,paddingLeft } = node
    tempStyle.padding = paddingTop?paddingTop:0+"px "+paddingRight?paddingRight:0+"px "+paddingBottom?paddingBottom:0+"px "+paddingLeft?paddingLeft:0+"px"
    tempStyle.boxSizing = "border-box"
  }

  const setEffects =()=>{
    if(effects){
      effects.forEach(fx => {
        const {type:fxType,offset,radius,visible,color} = fx
        if (visible) {
          switch (fxType) {
            case "DROP_SHADOW":
              const { x,y } = offset
              tempStyle.boxShadow = x +"px "+y+"px "+radius+"px "+ RenderedColor(color);
            break;
          }
        }
      })
    }
  }
  const setRotate =()=>tempStyle.transform = "rotate("+Math.round(rotations[id].rotation)+"deg)"
  //@TODO rotate shadow as well :)

  const setPosition =()=>{
    const { x,y,width,height } = absoluteBoundingBox
    tempStyle.position = "absolute"
    let top = y - currentFrame.absoluteBoundingBox.y
    let left = x - currentFrame.absoluteBoundingBox.x
    if(constraints){

      switch (constraints.horizontal) {
        case "SCALE":
          tempStyle.left = left
          tempStyle.width = width/currentFrame.absoluteBoundingBox.width*100 + "%"
        ;break;
        case "MIN":case "CENTER":tempStyle.left = left ;break;
        case "MAX": tempStyle.right = currentFrame.absoluteBoundingBox.width - (width + left);break;
        case "STRETCH":
          tempStyle.left = left
          tempStyle.right = currentFrame.absoluteBoundingBox.width - (width + left)
        ;break;
      }
      switch (constraints.vertical) {
        case "SCALE":
          tempStyle.top = top
          tempStyle.height = height/currentFrame.absoluteBoundingBox.height*100 + "%"
          ;break;
        case "MIN":case "CENTER":tempStyle.top = top;break;
        case "MAX":tempStyle.bottom = currentFrame.absoluteBoundingBox.height - (height + top);break;
        case "STRETCH":
          tempStyle.top = top
          tempStyle.bottom = currentFrame.absoluteBoundingBox.height - (height + top)
        ;break;
      }
    }
    else {
      tempStyle.top = top
      tempStyle.left = left
    }

    if(nodeTree.hasOwnProperty(parent)&&nodeTree[parent].type !== 'FRAME'&&nodeTree[parent].type !== 'GROUP'){
      const parentPos = nodeTree[parent].absoluteBoundingBox
      switch (constraints.horizontal) {
        case "MIN":case "CENTER":case "SCALE":tempStyle.left = tempStyle.left - (parentPos.x - currentFrame.absoluteBoundingBox.x);break;
        case "MAX":tempStyle.right = tempStyle.right - parentPos.width - (width + left);break;
        case "STRETCH":
          tempStyle.left = tempStyle.left - parentPos.x
          tempStyle.right = tempStyle.right - parentPos.width - (width + left)
        ;break;
      }
      switch (constraints.vertical) {
        case "MIN":case "CENTER":case "SCALE":tempStyle.top = tempStyle.top - (parentPos.y - currentFrame.absoluteBoundingBox.y);break;
        case "MAX":tempStyle.bottom = tempStyle.bottom - parentPos.height - (height + top);break;
        case "STRETCH":
          tempStyle.top = tempStyle.top - parentPos.y
          tempStyle.bottom = tempStyle.bottom - parentPos.width - (width + left)
        ;break;
      }
    }
  }


  const setVisibility = ()=>{
    if(visible!==undefined){
      const setKey = {
        id,attribute:"visible",value:visible
      }
      dispatch({type:'SET_ATTRIBUTE',payload:setKey})
      if(!visible)tempStyle.display = "none"
    }

    if(pluginState.pluginConditions.hasOwnProperty(id)) {
      const showMe = Object.keys(pluginState.pluginConditions[id]).every(condition => {
        const isVisible = ReturnVisibility(pluginState,pluginState.pluginConditions[id][condition])
        if(isVisible) return true
        else return false
      })
      if(!showMe)tempStyle.display = "none"
    }
    if(nodeStyle)setNodeStyle({...nodeStyle,...tempStyle})

  }

  const setChild =()=>{
    const itemSpacing = nodeTree[parent].itemSpacing
    const firstChild = Object.entries(nodeTree[parent].children)[0].id === id
    if(!firstChild)tempStyle[nodeTree[parent].layoutMode==="VERTICAL"?"marginTop":"marginLeft"] = itemSpacing
    const flexDirectionIsHorizontal = nodeTree[parent].layoutMode==="HORIZONTAL"
      if(flexChild&&node.layoutAlign==='STRETCH')tempStyle[flexDirectionIsHorizontal?'height':'width'] = "100%"
      if (flexChild) {
        if(node.layoutGrow===1)tempStyle.flex = 1
        else tempStyle[flexDirectionIsHorizontal?'width':'height'] = absoluteBoundingBox[flexDirectionIsHorizontal?'width':'height']
      }
  }

  const setRadius=()=>{
    if(node.hasOwnProperty("rectangleCornerRadius")){
      const radius = node.rectangleCornerRadius.reduce((acc,itm,idx)=>{
        acc = acc + itm+"px "
        return acc
      },"")
      tempStyle.borderRadius = radius
      tempStyle.overflow = "hidden"
    }
      if(node.hasOwnProperty("cornerRadius")){
        tempStyle.borderRadius = node.cornerRadius
        tempStyle.overflow = "hidden"
    }
  }

  const centerStyle = isParent =>{
    if(nodeStyle){
      const centerParent = {...nodeStyle}
      const childStyle = {...nodeStyle}
      delete centerParent.width
      delete centerParent.height
      delete childStyle.height
      delete centerParent.left
      delete centerParent.right

      const x = node.absoluteBoundingBox.x - currentFrame.absoluteBoundingBox.x
      const isLeft = x <= (currentFrame.absoluteBoundingBox.width - childStyle.width) / 2

      let calcChildWidth
      if(isLeft){
        calcChildWidth = currentFrame.absoluteBoundingBox.width - (x*2)
      } else {
        const xRight = (currentFrame.absoluteBoundingBox.width - (childStyle.width + childStyle.left))
        calcChildWidth = currentFrame.absoluteBoundingBox.width - (xRight*2)
        childStyle.display = "flex"
        childStyle.justifyContent = "flex-end"
      }

      delete childStyle.position
      delete childStyle.left
      delete childStyle.top
      delete childStyle.bottom
      childStyle.width = calcChildWidth
      if(!centerParent.width)delete centerParent.width
      if(!childStyle.width)delete childStyle.width

      return isParent==='parent'?centerParent:childStyle
    } else return {background:'red'}
  }

  const handleEvent = eventType =>{

    if (pluginState.pluginActions.hasOwnProperty(id)) {
      Object.keys(pluginState.pluginActions[id]).forEach(action => {
        if(eventType.indexOf(pluginState.pluginActions[id][action].eventType) !== -1 ){
          dispatch({type:'UPDATE_PLUGIN_STATE',payload:{
            pluginAction:pluginState.pluginActions[id][action],eventType
          }})
        }
      })
      makeClickable(true)
    }
    if(reactions.length)makeClickable(true)
  }


  const handleClick = ()=>{
    handleEvent(['Click'])
    if(reactions.length) dispatch({type:'SET_CURRENT_FRAME_ID',payload:reactions[0].action.destinationId})
  }

  const setNodeActions = ()=>{
    let setNode = {...node}
    const { pluginActions,pluginConditions } = pluginState
    if(pluginActions.hasOwnProperty(id))setNode.actions = pluginActions[id]
    if(pluginConditions.hasOwnProperty(id))setNode.conditions = pluginConditions[id]
    dispatch({type:'ADD_CHILD_ELEMENT',payload:setNode})
  }



  const updateVisibility =()=>{
    if (nodeTree&&nodeTree.hasOwnProperty(id)&&nodeTree[id].hasOwnProperty('conditions')) {
      const isVisible = Object
      .keys(nodeTree[id].conditions)
      .every(condition=>{
        if (ReturnVisibility(pluginState,nodeTree[id].conditions[condition])) return true
        else return false
      })

      let temp = {}
      if(!isVisible)temp.display = 'none'
      else temp.display = flexParent?'flex':'block'
      if(nodeStyle)setNodeStyle({...nodeStyle,...temp})
    }
  }



  useEffect(()=>{
    if(nodeTree&&parent!==currentFrame.id)setParentNode(nodeTree[parent])
  },[figmaData,nodeTree])

  useEffect(setNodeActions,[nodeTree,currentFrameID,pluginStateChanges])
  useEffect(()=>{
    if(nodeTree){
      if(parent&&nodeTree.hasOwnProperty(parent)&&nodeTree[parent].layoutMode !== 'NONE')setFlexChild(nodeTree[parent].hasOwnProperty("layoutMode"))
      setRadius()
      if(flexParent)setFlex()
      if(opacity)setOpacity()
      setDimension()
      //if(rotations&&!rotations.hasOwnProperty('noRotations'))setRotate()
      setEffects()
      if(!flexChild)setPosition()
      else setChild()
      setVisibility()
      setNodeStyle(tempStyle)
    }
  },[figmaData,nodeTree,flexChild])


  useEffect(setVisibility,[pluginStateChanges])
  useEffect(updateVisibility,[updateVis,nodeTree])
  if(nodeStyle===null)return null
  let renderThis
  switch (type) {
    case "VECTOR":
      if(nodeStyle&&vectors&&vectors.hasOwnProperty(id))renderThis = <Vector handleClick={handleClick} style={nodeStyle} node={node}/>
      else return null;break;
    case "TEXT":renderThis = <Text handleClick={handleClick} style={nodeStyle} node={node}/>;break;
    case "ELLIPSE":renderThis = <Ellipse handleClick={handleClick} style={nodeStyle} node={node}/>;break;
    default: renderThis = (
      <article
        style={type!=='GROUP'?nodeStyle:null}
        onMouseEnter={()=>handleEvent(['MouseEnter','Hover'])}
        onMouseLeave={()=>handleEvent(['MouseLeave','Hover'])}
        onClick={handleClick}
        className={`Element ${type} ${name.split(' ').join('_')} ${flexChild?'flexChild':''} ${flexParent?'flexParent':''} ${clickable||transitionNodeID?'clickable':''}`}>
        {(type!=="TEXT"&&type!=="VECTOR"&&type!=="BOOLEAN_OPERATION")&&<Background element={node}/>}
        {(type!=="TEXT"&&type!=="VECTOR"&&type!=="BOOLEAN_OPERATION")&&<Stroke element={node}/>}
        {(pluginState.hasOwnProperty('pluginFields')&&pluginState.pluginFields.hasOwnProperty(id))&&<Field handleClick={handleClick} style={nodeStyle} node={node}/>}
        {node.children&&Object.keys(node.children).map(key=>{
          const child = node.children[key]
          return (
            <Element
              parent={node.id}
              key={key}
              node={child}/>
          )
        })}
      </article>
    )

  }

  if(node.hasOwnProperty('constraints')&&node.constraints.horizontal === "CENTER") {
    return (
      <main
        style={centerStyle("parent")}
        className="centerParent">
        <section
          className="childStyle"
          style={centerStyle("child")}>{renderThis}</section>
      </main>
    )
  } else return renderThis



}

export default Element
