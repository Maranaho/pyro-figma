import { useContext,useEffect,useState } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import RenderedColor from '../../Utils/RenderedColor'
import ProtoActions from '../ProtoActions'
import Frames from '../Frames'
import Loading from '../Loading'

const Prototype = ()=>{
  const dispatch = useContext(PyroDispatchContext)
  const { direction,currentBreakpoint,breakPoints,rwd,currentFrameIDX,protoWidth,figmaData,figmaFile,loading,currentPageIDX,currentPageID,selection,nodeTree } = useContext(PyroStateContext)
  const basicGrey = "rgba(229.00000154972076,229.00000154972076,229.00000154972076,1)"
  const [ bg,setBG ] = useState(null)

  const pageIdx = ()=>{
    if (currentPageID&&figmaData) {
      figmaData.document.children.every((page,i)=>{
        if(page.id === currentPageID){
          dispatch({type:'RESET_CURRENTPAGE',payload:i})
          setTimeout(()=>dispatch({type:'RMV_LOADING'}),0)
          return false
        } else return true
      })
    }
  }

  const getBreakPoints = ()=>{
    const currWidth = Math.round(protoWidth)
    if(nodeTree){
      const frame = figmaData.document.children[currentPageIDX].children[currentFrameIDX]
      const key = Object.keys(frame)
      .filter(key=>frame.name.toLowerCase().indexOf(key.split("**")[0])!== -1)
      const setPoints = figmaData.document.children[currentPageIDX].children
      .filter(currFrame=>currFrame.hasOwnProperty(key[0]))
      .map(currFrame=>{
        return {index:currFrame.index,id:currFrame.id,name:currFrame.name,breakPoint:currFrame[key[0]]}
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
    if (figmaData) {
      const background = RenderedColor(figmaData.document.children[currentPageIDX].backgroundColor)
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
