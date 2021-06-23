import React,{ useContext,useEffect,useState } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import Background from '../Background'
import Stroke from '../Stroke'
import Vector from '../Vector'
import Text from '../Text'
import Ellipse from '../Ellipse'
import './Element.css'

const Element = ({node,parent}) =>{
  const dispatch = useContext(PyroDispatchContext)
  const { vectors,figmaData,currentFrameIDX,nodeTree,protoWidth,protoHeight,currentPageIDX } = useContext(PyroStateContext)

  const currentPage = figmaData.document.children[currentPageIDX]
  const currentFrame = currentPage.children[currentFrameIDX]
  const { visible,constraints,type,id,name,absoluteBoundingBox,layoutMode } = node
  const [ parentNode,setParentNode ] = useState(currentFrame)
  const [ nodeStyle,setNodeStyle ] = useState(null)
  const [ flexChild,setFlexChild ] = useState(false)
  const flexParent = node.hasOwnProperty("layoutMode")
  let tempStyle = {}

  const setDimension =()=>{
    const { width,height } = absoluteBoundingBox
    switch (constraints.horizontal) {
      case "CENTER":case "LEFT":case "RIGHT":tempStyle.width = width;break;
    }
    switch (constraints.vertical) {
      case "CENTER":case "TOP":case "BOTTOM":tempStyle.height = height;break;
    }
  }

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



  const setPosition =()=>{
    const { x,y,width,height } = absoluteBoundingBox
    tempStyle.position = "absolute"
    let top = y - currentFrame.absoluteBoundingBox.y
    let left = x - currentFrame.absoluteBoundingBox.x
    switch (constraints.horizontal) {
      case "LEFT":case "CENTER":tempStyle.left = x - currentFrame.absoluteBoundingBox.x;break;
      case "RIGHT":tempStyle.right = currentFrame.absoluteBoundingBox.width - (width + left);break;
      case "LEFT_RIGHT":
        tempStyle.left = left
        tempStyle.right = currentFrame.absoluteBoundingBox.width - (width + left)
      ;break;
    }
    switch (constraints.vertical) {
      case "TOP":case "CENTER":tempStyle.top = y - currentFrame.absoluteBoundingBox.y;break;
      case "BOTTOM":tempStyle.bottom = currentFrame.absoluteBoundingBox.height - (height + top);break;
      case "TOP_BOTTOM":
        tempStyle.top = top
        tempStyle.bottom = currentFrame.absoluteBoundingBox.height - (height + top)
      ;break;
    }
    if(nodeTree.hasOwnProperty(parent)){
      const parentPos = nodeTree[parent].absoluteBoundingBox
      switch (constraints.horizontal) {
        case "LEFT":case "CENTER":tempStyle.left = tempStyle.left - parentPos.x;break;
        case "RIGHT":tempStyle.right = tempStyle.right - parentPos.width - (width + left);break;
        case "LEFT_RIGHT":
          tempStyle.left = tempStyle.left - parentPos.x
          tempStyle.right = tempStyle.right - parentPos.width - (width + left)
        ;break;
      }
      switch (constraints.vertical) {
        case "TOP":case "CENTER":tempStyle.top = tempStyle.top - parentPos.y;break;
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
      tempStyle.visibility = visible?"visible":"hidden"
    }
  }

  const setChild =()=>{
    const itemSpacing = nodeTree[parent].itemSpacing
    const firstChild = nodeTree[parent].children[0].id === id
    if(!firstChild)tempStyle[nodeTree[parent].layoutMode==="VERTICAL"?"marginTop":"marginLeft"] = itemSpacing
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

  useEffect(()=>{
    if(nodeTree&&parent!==currentFrame.id)setParentNode(nodeTree[parent])
  },[figmaData,nodeTree])

  useEffect(()=>{
    dispatch({type:'ADD_CHILD_ELEMENT',payload:node})
    if(nodeTree){
      if(parent&&nodeTree.hasOwnProperty(parent))setFlexChild(nodeTree[parent].hasOwnProperty("layoutMode"))
      setRadius()
      if(flexParent)setFlex()
      setDimension()
      if(!flexChild)setPosition()
      else setChild()
      setVisibility()
      setNodeStyle(tempStyle)
    }
  },[figmaData,nodeTree,flexChild])

  let renderThis
  switch (type) {
    case "VECTOR":
      if(nodeStyle&&vectors.hasOwnProperty(id))renderThis = <Vector style={nodeStyle} node={node}/>
      else return null;break;
    case "TEXT":renderThis = <Text style={nodeStyle} node={node}/>;break;
    case "ELLIPSE":renderThis = <Ellipse style={nodeStyle} node={node}/>;break;
    default: renderThis = (
      <article style={nodeStyle} className={`Element ${type} ${name.split(' ').join('_')} ${flexChild?'flexChild':''} ${flexParent?'flexParent':''}`}>
        {(type!=="TEXT"&&type!=="VECTOR")&&<Background element={node}/>}
        {(type!=="TEXT"&&type!=="VECTOR")&&<Stroke element={node}/>}
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
    const centerParent = {...nodeStyle}
    const childStyle = {...nodeStyle}
    delete centerParent.width
    delete centerParent.left
    delete centerParent.right

    const isLeft = childStyle.hasOwnProperty('left')
    const calcChildWidth = isLeft?childStyle.left*2:childStyle.right*2
    delete childStyle.position
    delete childStyle.left
    delete childStyle.top
    delete childStyle.right
    delete childStyle.bottom
    childStyle.width = currentFrame.absoluteBoundingBox.width-calcChildWidth
    if(!centerParent.width)delete centerParent.width
    if(!childStyle.width)delete childStyle.width
    return (
      <main
        style={centerParent}
        className="centerParent">
        <section
          className={`childStyle ${isLeft?'isLeft':'isRight'}`}
          style={childStyle}>{renderThis}</section>
      </main>
    )
  }
  else return renderThis



}

export default Element
