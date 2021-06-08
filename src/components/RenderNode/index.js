import React,{ useContext,useEffect,useState } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import Background from '../Background'
import Text from '../Text'
import './RenderNode.css'

const RenderNode = ({ node })=>{
  const { figmaData,currentFrameIDX,currentPageIDX,protoWidth,protoHeight,nodeTree } = useContext(PyroStateContext)
  const currentFrame = figmaData.document.children[currentPageIDX].children[currentFrameIDX]
  const [ layout,setLayout ] = useState(null)

  const getLayout = node => {
    let buildLayout = {}
    const { x,y,constraints,id,name,absoluteBoundingBox,type,rectangleCornerRadii,children,parent,characters,layoutMode } = node
    const { vertical,horizontal } = constraints
    const parentFrame = nodeTree[parent]
    const frameBox = parentFrame.absoluteBoundingBox
    let flexChild = parentFrame.hasOwnProperty("layoutMode")?true:false
    const { width,height } = absoluteBoundingBox

    switch (vertical) {
      case "TOP":
        //if(!flexChild)buildLayout.top = -y
        buildLayout.minHeight = height;
      break;

      case "BOTTOM":
        buildLayout.minHeight = height;
        //if(!flexChild)buildLayout.bottom = (frameBox.height - -y) - height
      ;break;

      case "CENTER":
        buildLayout.minHeight = height
      ;break;

      case "TOP_BOTTOM":;break;
      case "SCALE":;break;
      default:
    }

    switch (horizontal) {
      case "LEFT":
        //if(!flexChild)buildLayout.left = x;
        buildLayout.minWidth = width
      break;

      case "RIGHT":
          buildLayout.minWidth = width
          //if(!flexChild)buildLayout.right = (frameBox.width - x) - width
      ;break;

      case "CENTER":
        buildLayout.minWidth = width
      ;break;
      case "LEFT_RIGHT":
      if(!flexChild){
        buildLayout.left = x
        buildLayout.right = frameBox.width - (width + x)
      }
      ;break;
      case "SCALE":;break;
      default:
    }

    if(rectangleCornerRadii){
      const radius = rectangleCornerRadii.reduce((acc,itm,idx)=>{
        acc = acc + itm+"px "
        return acc
      },"")
      buildLayout.borderRadius = radius
      buildLayout.overflow = "hidden"
    }
    buildLayout.position = "absolute"
    if(flexChild){
      const itemSpacing = nodeTree[parent].itemSpacing
      const firstChild = nodeTree[parent].children[0].id
      if(id!==firstChild)buildLayout.marginLeft = itemSpacing
      delete buildLayout["top"]
      delete buildLayout["right"]
      delete buildLayout["left"]
      delete buildLayout["bottom"]
      buildLayout.flexChild = true
    } else buildLayout.position = "absolute"
    if(layoutMode){
      const { paddingTop,paddingRight,paddingBottom,paddingLeft } = node
      buildLayout.padding = paddingTop+"px "+paddingRight+"px "+paddingBottom+"px "+paddingLeft+"px"
      buildLayout.boxSizing = "border-box"
      buildLayout.display = "flex"
      buildLayout.flexParent = true
    }
    return buildLayout
  }

  return (
    <article
      className={`RenderNode ${getLayout(node).flexChild?'flexChild':''} ${getLayout(node).flexParent?'flexParent':''}`}
      id={node.name.toLowerCase().split(' ').join('_')}
      style={getLayout(node)}>
      {node.type!=='TEXT'&&node.type!=='VECTOR'&&<Background element={node}/>}
      {node.children&&node.children.map(child=> <RenderNode node={child} key={child.id}/>)}
      <span>{node.name}</span>
    </article>
  )
}
export default RenderNode
