import { useContext,useEffect,useState } from 'react'
import FireBaseInit from '../../Utils/FireBaseInit'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import PyroStateContext from '../../context/PyroStateContext'
import PyroDispatchContext from '../../context/PyroDispatchContext'
import PyroReducer, { initialPyroState } from '../../reducers/PyroReducer'
import GetFileFromToken from '../../Utils/GetFileFromToken'
import GetMe from '../../Utils/GetMe'
import RenderedColor from '../../Utils/RenderedColor'
import ProtoActions from '../ProtoActions'
import Frames from '../Frames'
import Loading from '../Loading'

firebase.initializeApp(FireBaseInit)

const FIGMA_CLIENT_ID = process.env.REACT_APP_FIGMA_CLIENT_ID
const FIGMA_SECRET = process.env.REACT_APP_FIGMA_SECRET
const URL_CB = process.env.REACT_APP_URL_CB
const FIGMA_SESSION = process.env.REACT_APP_FIGMA_SESSION

const Prototype = ()=>{
  const dispatch = useContext(PyroDispatchContext)
  const { figmaData,figmaFile,loading,currentPageIDX,token,me } = useContext(PyroStateContext)
  const firestore = firebase.firestore()
  const fileDB = firestore.collection('figma-files').doc(figmaFile).collection("fileData")
  const selectionDB = fileDB.doc("users").collection("selections")
  const querySelect = selectionDB.where("email", "==", me?me.email:'null')
  const [vectorDB] = useCollectionData(fileDB,{idField:'id'})
  const [selection] = useCollectionData(querySelect,{idField:'id'})
  if(vectorDB&&vectorDB.length&&me)console.log(vectorDB[1])
  if(selection&&selection.length&&me)console.log(selection)

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
      if(token){
        window.localStorage.setItem('figmaToken', token)
        GetFileFromToken(token,dispatch,figmaFile)
      } else {
        console.log('nope');
        console.log({getCode:getCode()});
        console.log({FIGMA_CLIENT_ID});
        console.log({FIGMA_SECRET});
        console.log({URL_CB});
        console.log({requestOptions});
      }
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

  useEffect(()=>{
    if(figmaData&&token)GetMe(token,dispatch)
  },[figmaData,token])

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
    <main className="FigmaProto">

      <ProtoActions/>
      <section style={bg} className="Prototype">
        {figmaData&&!loading?<Frames/>:<Loading/>}
      </section>
    </main>
  )
}

export default Prototype
