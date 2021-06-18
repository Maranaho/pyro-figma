import { useReducer,useEffect,useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import PyroStateContext from './context/PyroStateContext'
import PyroDispatchContext from './context/PyroDispatchContext'
import PyroReducer, { initialPyroState } from './reducers/PyroReducer'
import Prototype from './components/Prototype'
import Landing from './components/Landing'
import './bolt_fonts.css'
import './assets/iconfont/harmonyicons.css'
import './App.css'
const App = ()=>{

  const [ state, dispatch ] = useReducer(PyroReducer, initialPyroState)
  return (
    <PyroDispatchContext.Provider value={dispatch}>
      <PyroStateContext.Provider value={state}><Router>
          <Switch>
            <Route exact path="/figma/:params" component={Prototype} />
            <Route path="/figma/prototype" component={Prototype} />
          </Switch>
        </Router>
      </PyroStateContext.Provider>
    </PyroDispatchContext.Provider>
  )
}

export default App
