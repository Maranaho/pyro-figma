import { useReducer,useEffect,useState } from 'react'
import PyroStateContext from './context/PyroStateContext'
import PyroDispatchContext from './context/PyroDispatchContext'
import PyroReducer, { initialPyroState } from './reducers/PyroReducer'
import ProtoActions from './components/ProtoActions'
import Frames from './components/Frames'
import Loading from './components/Loading'
import GetFileFromToken from './Utils/GetFileFromToken'
import RenderedColor from './Utils/RenderedColor'
import './bolt_fonts.css'
import './assets/iconfont/harmonyicons.css'
import './App.css'

const FIGMA_CLIENT_ID = process.env.REACT_APP_FIGMA_CLIENT_ID
const FIGMA_SECRET = process.env.REACT_APP_FIGMA_SECRET
const URL_CB = process.env.REACT_APP_URL_CB
const FIGMA_SESSION = process.env.REACT_APP_FIGMA_SESSION


const App = ()=>{

  const [ state, dispatch ] = useReducer(PyroReducer, initialPyroState)
  const { figmaData,figmaFile,loading,currentPageIDX } = state
  const [ bg,setBG ] = useState(null)
  const getCode = ()=>{
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get('code')
  }

  const getToken = () => {

    const myHeaders = new Headers()
    myHeaders.append("Cookie", "figma.session="+FIGMA_SESSION)
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    }

  fetch("https://www.figma.com/api/oauth/token?client_id="+FIGMA_CLIENT_ID+"&client_secret="+FIGMA_SECRET+"&redirect_uri="+URL_CB+"&code="+ getCode() +"&grant_type=authorization_code", requestOptions)
    .then(res => res.text())
    .then(res => {
      const token = JSON.parse(res).access_token
      window.localStorage.setItem('figmaToken', token)
      GetFileFromToken(token,dispatch,figmaFile)
    })
    .catch(err => console.error(err))
  }

  const retrieveToken = ()=>{
    const tokenFromStorage = window.localStorage.getItem('figmaToken')
    if (!tokenFromStorage) getToken()
    else {
      dispatch({type:'TOKEN',payload:tokenFromStorage})
      GetFileFromToken(window.localStorage.getItem('figmaToken'),dispatch,figmaFile)
    }
  }


  useEffect(retrieveToken,[])
  useEffect(()=>{
    if (figmaData) {
      const background = RenderedColor(figmaData.document.children[currentPageIDX].backgroundColor)
      const basicGrey = "rgba(229.00000154972076,229.00000154972076,229.00000154972076,1)"
      if(background !== basicGrey)setBG({background})
      else setBG(null)
    }
  },[figmaData,currentPageIDX])

  return (
    <PyroDispatchContext.Provider value={dispatch}>
      <PyroStateContext.Provider value={state}>
        <ProtoActions/>
        <section style={bg} className="Prototype">
          {figmaData&&!loading?<Frames/>:<Loading/>}
        </section>
      </PyroStateContext.Provider>
    </PyroDispatchContext.Provider>
  )
}

export default App
