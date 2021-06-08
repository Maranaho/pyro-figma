import React,{ useContext,useEffect,useState } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import Background from '../Background'
import './Element.css'

const Element = ({node,parent}) =>{
  const dispatch = useContext(PyroDispatchContext)
  const { figmaData,currentPageIDX,currentFrameIDX,nodeTree } = useContext(PyroStateContext)
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
      case "LEFT":case "RIGHT":tempStyle.width = width;break;
    }
    switch (constraints.vertical) {
      case "TOP":case "BOTTOM":tempStyle.height = height;break;
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
    console.clear()
    console.log(node);
    const { primaryAxisAlignItems,counterAxisAlignItems } = node
    tempStyle.display = "flex"
    if(layoutMode === 'VERTICAL')tempStyle.flexDirection = 'column'
    tempStyle.justifyContent = setAxis(primaryAxisAlignItems)
    tempStyle.alignItems = setAxis(counterAxisAlignItems)
    const { paddingTop,paddingRight,paddingBottom,paddingLeft } = node
    tempStyle.padding = paddingTop+"px "+paddingRight+"px "+paddingBottom+"px "+paddingLeft+"px"
    tempStyle.boxSizing = "border-box"
  }

  const setText =()=>{
    tempStyle.fontSize = 12
  }

  const setPosition =()=>{
    const { x,y,width,height } = absoluteBoundingBox
    tempStyle.position = "absolute"
    const top = y - currentFrame.absoluteBoundingBox.y
    const left = x - currentFrame.absoluteBoundingBox.x
    switch (constraints.horizontal) {
      case "LEFT":tempStyle.left = x - currentFrame.absoluteBoundingBox.x;break;
      case "RIGHT":tempStyle.right = currentFrame.absoluteBoundingBox.width - (width + left);break;
      case "LEFT_RIGHT":
        tempStyle.left = left
        tempStyle.right = currentFrame.absoluteBoundingBox.width - (width + left)
      ;break;
    }
    switch (constraints.vertical) {
      case "TOP":tempStyle.top = y - currentFrame.absoluteBoundingBox.y;break;
      case "BOTTOM":tempStyle.bottom = currentFrame.absoluteBoundingBox.height - (height + top);break;
      case "TOP_BOTTOM":
        tempStyle.top = top
        tempStyle.bottom = currentFrame.absoluteBoundingBox.height - (height + top)
      ;break;
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
    if(!firstChild)tempStyle.marginLeft = itemSpacing
  }

  useEffect(()=>{
    if(nodeTree&&parent!==currentFrame.id)setParentNode(nodeTree[parent])
  },[figmaData,nodeTree])

  useEffect(()=>{
    dispatch({type:'ADD_CHILD_ELEMENT',payload:node})
    if(nodeTree){
      setFlexChild(nodeTree[parent].hasOwnProperty("layoutMode"))
      setText()
      if(flexParent)setFlex()
      setDimension()
      if(!flexChild)setPosition()
      else setChild()
      setVisibility()
      setNodeStyle(tempStyle)
    }
  },[figmaData,nodeTree,flexChild])

  return (
    <article style={nodeStyle} className={`Element ${node.name.split(' ').join('_')} ${flexChild?'flexChild':''} ${flexParent?'flexParent':''}`}>
      {type!=="TEXT"&&<Background element={node}/>}
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

export default Element
