import { useReducer,useEffect } from 'react'
import PyroStateContext from './context/PyroStateContext'
import PyroDispatchContext from './context/PyroDispatchContext'
import PyroReducer, { initialPyroState } from './reducers/PyroReducer'
import GetFileFromToken from './Utils/GetFileFromToken'
import ProtoActions from './components/ProtoActions'
import './bolt_fonts.css'
import './assets/iconfont/harmonyicons.css'
import './App.css'

const FIGMA_CLIENT_ID = process.env.REACT_APP_FIGMA_CLIENT_ID
const FIGMA_SECRET = process.env.REACT_APP_FIGMA_SECRET
const URL_CB = process.env.REACT_APP_URL_CB
const FIGMA_SESSION = process.env.REACT_APP_FIGMA_SESSION


const App = ()=>{
  const [ state, dispatch ] = useReducer(PyroReducer, initialPyroState)

  const getCode = ()=>{
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get('code')
  }

  const retrieveToken = ()=>{
    const tokenFromStorage = window.localStorage.getItem('figmaToken')
    dispatch({type:'TOKEN',payload:tokenFromStorage})
    if (!tokenFromStorage) getToken(getCode())
    else GetFileFromToken(window.localStorage.getItem('figmaToken'),dispatch)
  }


  const getToken = code => {
    const myHeaders = new Headers()
    myHeaders.append("Cookie", "figma.session="+FIGMA_SESSION)
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    }

    fetch("https://www.figma.com/api/oauth/token?client_id="+FIGMA_CLIENT_ID+"&client_secret="+FIGMA_SECRET+"&redirect_uri="+URL_CB+"&code="+code+"&grant_type=authorization_code", requestOptions)
      .then(res => res.text())
      .then(res => {
        const token = JSON.parse(res).access_token
        window.localStorage.setItem('figmaToken', token)
        dispatch({type:'UPDATE_FILE_DATA_FROM_FIGMA',payload:GetFileFromToken(token)})
      })
      .catch(err => console.log({err}))
  }



  useEffect(retrieveToken,[])

  return (
    <PyroDispatchContext.Provider value={dispatch}>
      <PyroStateContext.Provider value={state}>
        <ProtoActions/>
      </PyroStateContext.Provider>
    </PyroDispatchContext.Provider>
  )
}

export default App
