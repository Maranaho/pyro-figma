import React,{ useContext,useEffect } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import './Frames.css'

const Frames = ()=>{

  const dispatch = useContext(PyroDispatchContext)
  const { figmaData,currentPageIDX,currentFrameIDX } = useContext(PyroStateContext)
  const currentPage = figmaData.document.children[currentPageIDX]

  const protoStart =()=>{
    currentPage.children.every((frame,idx)=>{
      if(frame.id === currentPage.prototypeStartNodeID){
        dispatch({type:'SET_CURRENT_FRAME_IDX',payload:idx})
        return false
      } else return true
    })
  }

  const setCurrentFrame = ()=>{
    console.clear()
    protoStart()
    figmaData.document.children[currentPageIDX].children.forEach(frame => {
      //console.log(frame);
    })

  }

  useEffect(setCurrentFrame,[figmaData])
  return (
    <main className="Frames">
      {currentPage.children.length?
        <p>{currentPage.children[currentFrameIDX].name}</p>:
        <section className="empty">
          <p>
            <span>There's no frame in this page</span>
            <span>😲</span>
          </p>
        </section>
      }
    </main>
  )
}
export default Frames
