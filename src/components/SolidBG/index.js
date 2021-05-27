import React,{ useEffect } from 'react'
import './SolidBG.css'

const SolidBG = ({bg})=>{

  const makeSolidBG =()=>{
    console.log(bg);
  }



  useEffect(makeSolidBG,[])
  return (
    <div className="SolidBG">
      solid
    </div>
  )
}
export default SolidBG
