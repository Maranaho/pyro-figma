import { useContext,useEffect,useState } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import RenderedColor from '../../Utils/RenderedColor'
import ProtoActions from '../ProtoActions'
import Frames from '../Frames'
import Loading from '../Loading'

const Prototype = ()=>{
  const dispatch = useContext(PyroDispatchContext)
  const { nodeTreeLength,direction,currentBreakpoint,breakPoints,rwd,currentFrameID,protoWidth,figmaData,figmaFile,loading,currentPageIDX,currentPageID,selection,nodeTree } = useContext(PyroStateContext)
  const basicGrey = "rgba(229.00000154972076,229.00000154972076,229.00000154972076,1)"
  const [ bg,setBG ] = useState(null)


  const pageIdx = ()=>{
    if (currentPageID&&figmaData) {
      figmaData.children.every((page,i)=>{
        if(page.id === currentPageID){
          dispatch({type:'RESET_CURRENTPAGE',payload:i})
          return false
        } else return true
      })
    }
  }

  const getBreakPoints = ()=>{
    const currWidth = Math.round(protoWidth)
    if(nodeTree){
      const frame = figmaData.children[currentPageIDX].children[currentFrameID]
      const key = Object.keys(frame)
      .filter(key=>key.indexOf("**")!== -1)
      const setPoints = Object.keys(figmaData.children[currentPageIDX].children)
      .filter(childKey=>figmaData.children[currentPageIDX].children[childKey].hasOwnProperty(key[0]))
      .map(childKey=>{
        const currFrame = figmaData.children[currentPageIDX].children[childKey]
        return {id:currFrame.id,name:currFrame.name,breakPoint:currFrame[key[0]]}
      }).sort((a,b)=>a.breakPoint - b.breakPoint)


      dispatch({type:'SET_BREAKPOINTS',payload:setPoints})
    }
  }

  const handleResize =()=>{
    if (breakPoints&&breakPoints.length) {
      const w = Math.round(protoWidth)
      if(direction){
        if(currentBreakpoint+1<breakPoints.length&&w>breakPoints[currentBreakpoint+1].breakPoint){
          dispatch({type:'SET_CURRENT_BPOINT',payload:currentBreakpoint+1})
        }
      } else if(w<breakPoints[currentBreakpoint].breakPoint&&currentBreakpoint-1>=0){
        dispatch({type:'SET_CURRENT_BPOINT',payload:currentBreakpoint-1})
      }
    }
  }


  useEffect(pageIdx,[currentPageID,selection])
  useEffect(handleResize,[protoWidth])
  useEffect(getBreakPoints,[nodeTree])

  useEffect(()=>{
    if (figmaData&&figmaData.hasOwnProperty('document')) {
      const background = RenderedColor(figmaData.children[currentPageIDX].backgroundColor)
      if(background !== basicGrey)setBG({background})
      else setBG(null)
    }
  },[figmaData,currentPageIDX])

  return (
    <main className="FigmaProto">
      <ProtoActions/>
      <section style={bg} className="Prototype">
        {figmaData&&!loading?<Frames/>:<Loading/>}
      </section>
    </main>
  )
}

export default Prototype
