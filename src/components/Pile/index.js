import { useEffect,useContext } from 'react'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import './Pile.css'

const Pile = ({msg})=>{
  const dispatch = useContext(PyroDispatchContext)
  useEffect(()=>{
    setTimeout(()=>dispatch({type:'HIDE_REQUEST'}),3000)
  },[])
  return (
    <main className="Pile">
      <article>{msg}</article>
    </main>
  )
}
export default Pile
