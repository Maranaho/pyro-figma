import React from 'react'
import Background from '../Background'
import './Ellipse.css'

const Ellipse = ({node,style}) =>(
  <article
    style={style}
    className={`Ellipse ${node.name.split(' ').join('_')} ${node.transitionNodeID?'clickable':null}`}>
    <Background element={node}/>
  </article>
)

export default Ellipse
