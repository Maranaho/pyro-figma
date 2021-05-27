import React,{ useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import mobile from '../../assets/images/mobile.svg'
import tablet from '../../assets/images/tablet.svg'
import desktop from '../../assets/images/desktop.svg'
import './Dimensions.css'

const Dimensions = ()=>{
  const dispatch = useContext(PyroDispatchContext)
  const { protoWidth,protoHeight,smoov,tabletWidth,tabletHeight } = useContext(PyroStateContext)
  const setDimensions = dimensions =>{
    let size = "SET_MOBILE"
    switch (dimensions) {
      case "mobile":size="SET_MOBILE";break;
      case "desktop":size="SET_DESKTOP";break;
      case "tablet":size="SET_TABLET";break;
      default:size="SET_MOBILE";
    }
    dispatch({type:size})
    setTimeout(()=>dispatch({type:'REMOVE_SMOOV'}),1000)
  }
  return (
    <div className="Dimensions">
      <button
        disabled={smoov}
        onClick={()=>setDimensions("mobile")}
        className={protoWidth <= 450 ?'active':null}>
        <img src={mobile} alt="mobile"/>
      </button>
      <button
        disabled={smoov}
        onClick={()=>setDimensions("desktop")}
        className={protoWidth > 1024 ?'active':null}>
        <img src={desktop} alt="desktop"/>
      </button>
      <button
        disabled={smoov}
        onClick={()=>setDimensions("tablet")}
        className={protoWidth === tabletWidth&&protoHeight === tabletHeight ?'active':null}>
        <img src={tablet} alt="mobile"/>
      </button>
  </div>
  )
}
export default Dimensions
