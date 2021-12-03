import { useReducer,useEffect } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import PyroReducer, { initialPyroState } from '../../reducers/PyroReducer'
import App from '../../App'

const InitFigma = ()=>{
  const [ state, dispatch ] = useReducer(PyroReducer, initialPyroState)
  const { figmaFile } = state
  useEffect(()=>{
    dispatch({type:'SET_FILEKEY',payload:window.location.href.split('state=')[1]})
  },[])
  if(!figmaFile)return <p>no file</p>
  return (
    <PyroDispatchContext.Provider value={dispatch}>
      <PyroStateContext.Provider value={state}>
        <App/>
      </PyroStateContext.Provider>
    </PyroDispatchContext.Provider>
  )
}

export default InitFigma
