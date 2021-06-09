import React,{ useEffect } from 'react'
import Background from '../Background'
import './Vector.css'

const Vector = ({node,style}) =>{
const { name } = node
const setVector = ()=>{

}
useEffect(setVector,[])
  return (
    <article style={style} className={`Vector ${node.name.split(' ').join('_')}`}>
      Vector
    </article>
  )
}

export default Vector
