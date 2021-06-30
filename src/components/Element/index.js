import React,{ useContext,useEffect,useState } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import RenderedColor from '../../Utils/RenderedColor'
import Background from '../Background'
import Stroke from '../Stroke'
import Vector from '../Vector'
import Text from '../Text'
import Ellipse from '../Ellipse'
import './Element.css'

const Element = ({node,parent}) =>{
  const dispatch = useContext(PyroDispatchContext)
  const { rotations,vectors,figmaData,currentFrameIDX,nodeTree,protoWidth,protoHeight,currentPageIDX } = useContext(PyroStateContext)

  const currentPage = figmaData.document.children[currentPageIDX]
  const currentFrame = currentPage.children[currentFrameIDX]
  const { transitionNodeID,opacity,effects,visible,constraints,type,id,name,absoluteBoundingBox,layoutMode } = node
  const [ parentNode,setParentNode ] = useState(currentFrame)
  const [ nodeStyle,setNodeStyle ] = useState(null)
  const [ flexChild,setFlexChild ] = useState(false)
  const flexParent = node.hasOwnProperty("layoutMode")
  let tempStyle = {}

  const setDimension =()=>{
    const { width,height } = absoluteBoundingBox
    switch (constraints.horizontal) {
      case "CENTER":case "LEFT":case "RIGHT":
        if(node.layoutAlign!=='STRETCH')tempStyle.width = width;
      break;
    }
    switch (constraints.vertical) {
      case "CENTER":case "TOP":case "BOTTOM":
        if(node.layoutGrow!== 1)tempStyle.height = height
        else tempStyle.height = "100%";
      break;
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
    tempStyle.padding = paddingTop+"px "+paddingRight+"px "+paddingBottom+"px "+paddingLeft+"px"
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
    switch (constraints.horizontal) {
      case "SCALE":
        tempStyle.left = left
        tempStyle.width = width/currentFrame.absoluteBoundingBox.width*100 + "%"
      ;break;
      case "LEFT":case "CENTER":tempStyle.left = left ;break;
      case "RIGHT":tempStyle.right = currentFrame.absoluteBoundingBox.width - (width + left);break;
      case "LEFT_RIGHT":
        tempStyle.left = left
        tempStyle.right = currentFrame.absoluteBoundingBox.width - (width + left)
      ;break;
    }
    switch (constraints.vertical) {
      case "SCALE":
        tempStyle.top = top
        tempStyle.height = height/currentFrame.absoluteBoundingBox.height*100 + "%"
        ;break;
      case "TOP":case "CENTER":tempStyle.top = top;break;
      case "BOTTOM":tempStyle.bottom = currentFrame.absoluteBoundingBox.height - (height + top);break;
      case "TOP_BOTTOM":
        tempStyle.top = top
        tempStyle.bottom = currentFrame.absoluteBoundingBox.height - (height + top)
      ;break;
    }
    if(nodeTree.hasOwnProperty(parent)){
      const parentPos = nodeTree[parent].absoluteBoundingBox
      switch (constraints.horizontal) {
        case "LEFT":case "CENTER":case "SCALE":tempStyle.left = tempStyle.left - (parentPos.x - currentFrame.absoluteBoundingBox.x);break;
        case "RIGHT":tempStyle.right = tempStyle.right - parentPos.width - (width + left);break;
        case "LEFT_RIGHT":
          tempStyle.left = tempStyle.left - parentPos.x
          tempStyle.right = tempStyle.right - parentPos.width - (width + left)
        ;break;
      }
      switch (constraints.vertical) {
        case "TOP":case "CENTER":case "SCALE":tempStyle.top = tempStyle.top - (parentPos.y - currentFrame.absoluteBoundingBox.y);break;
        case "BOTTOM":tempStyle.bottom = tempStyle.bottom - parentPos.height - (height + top);break;
        case "TOP_BOTTOM":
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
  }

  const setChild =()=>{
    const itemSpacing = nodeTree[parent].itemSpacing
    const firstChild = nodeTree[parent].children[0].id === id
    if(!firstChild)tempStyle[nodeTree[parent].layoutMode==="VERTICAL"?"marginTop":"marginLeft"] = itemSpacing
    const flexDirectionIsHorizontal = nodeTree[parent].layoutMode==="HORIZONTAL"
      if(flexChild&&node.layoutAlign==='STRETCH')tempStyle[flexDirectionIsHorizontal?'height':'width'] = "100%"
      if (flexChild) {
        if(node.layoutGrow===1)tempStyle.flex = 1
        else tempStyle[flexDirectionIsHorizontal?'width':'height'] = absoluteBoundingBox[flexDirectionIsHorizontal?'width':'height']
      }
  }

  const setRadius=()=>{
    if(node.hasOwnProperty("rectangleCornerRadii")){
      const radius = node.rectangleCornerRadii.reduce((acc,itm,idx)=>{
        acc = acc + itm+"px "
        return acc
      },"")
      tempStyle.borderRadius = radius
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
  const handleClick = ()=>{
    const nextPage = currentPage.children
    .filter(frame=>frame.id === transitionNodeID)[0]
    const nextPageIdx = currentPage.children.indexOf(nextPage)
    dispatch({type:'SET_CURRENT_FRAME_IDX',payload:nextPageIdx})
  }


  useEffect(()=>{
    if(nodeTree&&parent!==currentFrame.id)setParentNode(nodeTree[parent])
  },[figmaData,nodeTree])

  useEffect(()=>{
    dispatch({type:'ADD_CHILD_ELEMENT',payload:node})
    if(nodeTree){
      if(parent&&nodeTree.hasOwnProperty(parent))setFlexChild(nodeTree[parent].hasOwnProperty("layoutMode"))
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

  let renderThis
  switch (type) {
    case "VECTOR":
      if(nodeStyle&&vectors.hasOwnProperty(id))renderThis = <Vector onClick={transitionNodeID?handleClick:null} style={nodeStyle} node={node}/>
      else return null;break;
    case "TEXT":renderThis = <Text onClick={transitionNodeID?handleClick:null} style={nodeStyle} node={node}/>;break;
    case "ELLIPSE":renderThis = <Ellipse onClick={transitionNodeID?handleClick:null} style={nodeStyle} node={node}/>;break;
    default: renderThis = (
      <article style={nodeStyle} onClick={transitionNodeID?handleClick:null} className={`Element ${type} ${name.split(' ').join('_')} ${flexChild?'flexChild':''} ${flexParent?'flexParent':''} ${transitionNodeID?'clickable':null}`}>
        {(type!=="TEXT"&&type!=="VECTOR"&&type!=="BOOLEAN_OPERATION")&&<Background element={node}/>}
        {(type!=="TEXT"&&type!=="VECTOR"&&type!=="BOOLEAN_OPERATION")&&<Stroke element={node}/>}
        {node.children&&node.children.map(child=>{
          return (
            <Element
              parent={node.id}
              key={child.id}
              node={child}/>
          )
        })}
      </article>
    )

  }
  if(node.constraints.horizontal === "CENTER") {
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
