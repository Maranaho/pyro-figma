import React from 'react'
import Background from '../Background'
import './Ellipse.css'

const Ellipse = ({handleClick,node,style}) =>(
  <article
    onClick={handleClick}
    style={style}
    className={`Ellipse ${node.name.split(' ').join('_')} ${node.transitionNodeID?'clickable':null}`}>
    <Background element={node}/>
  </article>
)

export default Ellipse
