import React,{ useEffect } from 'react'
import Background from '../Background'
import './Vector.css'

const Vector = ({node,style}) =>{
const { name } = node
const setVector = ()=>{
  console.log(style);
}
useEffect(setVector,[])
  return (
    <div style={style} className={`Vector ${node.name.split(' ').join('_')}`}>
      {name}
    </div>
  )
}

export default Vector
