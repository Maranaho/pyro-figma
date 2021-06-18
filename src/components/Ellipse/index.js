import React from 'react'
import Background from '../Background'
import './Ellipse.css'

const Ellipse = ({node,style}) =>(
  <article
    style={style}
    className={`Ellipse ${node.name.split(' ').join('_')}`}>
    <Background element={node}/>
  </article>
)

export default Ellipse
