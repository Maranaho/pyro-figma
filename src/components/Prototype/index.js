import { useContext,useEffect,useState } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import RenderedColor from '../../Utils/RenderedColor'
import ProtoActions from '../ProtoActions'
import Frames from '../Frames'
import Loading from '../Loading'

const Prototype = ()=>{
  const dispatch = useContext(PyroDispatchContext)
  const { figmaData,figmaFile,loading,currentPageIDX,currentPageID,selection,nodeTree } = useContext(PyroStateContext)
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

  useEffect(pageIdx,[currentPageID,selection])

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
