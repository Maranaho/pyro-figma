import React,{ useContext,useEffect,useState } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import GetFileFromToken from '../../Utils/GetFileFromToken'
import pyro from '../../assets/images/pyro_white.svg'
import './ProtoActions.css'

const ProtoActions = ()=>{
  const dispatch = useContext(PyroDispatchContext)
  const { loading,figmaData,token,currentPageIDX } = useContext(PyroStateContext)
  const [ pagesOpen,setPagesOpen ] = useState(false)
  const handlePageMenuClick = e =>{
    dispatch({type:'SET_CURRENT_PAGE_IDX',payload:Number(e.target.getAttribute('idx'))})
    setPagesOpen(false)
  }
  return (
    <main className="ProtoActions">
      <section>
        <img src={pyro} height="27" alt="pyro"/>
      </section>
      {figmaData?
        <section className="fileInfo" onClick={()=>setPagesOpen(!pagesOpen)}>
          <h1>{figmaData.name} - {figmaData.document.children[currentPageIDX].name}</h1>
          <i className="hi hi-sm-chevron-down"/>
          <ul
            onMouseLeave={()=>setPagesOpen(false)}
            onClick={handlePageMenuClick}
            className={`pagesMenu ${pagesOpen?'open':''}`}>
            {figmaData.document.children.map((frame,idx)=><li idx={idx} key={frame.id}>{frame.name}</li>)}
          </ul>
        </section>:
        <h1 className="faded">Proto name - Page name</h1>
        }
      <section className="actions">
        <button className="full">
          <span>Share</span>
        </button>
        <button disabled={loading} onClick={()=>GetFileFromToken(token,dispatch)}><i className="hi hi-refresh"/></button>
    </section>
    </main>
  )
}
export default ProtoActions
