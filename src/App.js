import { useReducer,useEffect,useState } from 'react'
import FireBaseInit from './Utils/FireBaseInit'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import PyroStateContext from './context/PyroStateContext'
import PyroDispatchContext from './context/PyroDispatchContext'
import PyroReducer, { initialPyroState } from './reducers/PyroReducer'
import GetFileFromToken from './Utils/GetFileFromToken'
import GetMe from './Utils/GetMe'
import Prototype from './components/Prototype'
import Landing from './components/Landing'
import './bolt_fonts.css'
import './assets/iconfont/harmonyicons.css'
import './App.css'

firebase.initializeApp(FireBaseInit)

const FIGMA_CLIENT_ID = process.env.REACT_APP_FIGMA_CLIENT_ID
const FIGMA_SECRET = process.env.REACT_APP_FIGMA_SECRET
const URL_CB = process.env.REACT_APP_URL_CB
const FIGMA_SESSION = process.env.REACT_APP_FIGMA_SESSION

const App = ()=>{
  const [ state, dispatch ] = useReducer(PyroReducer, initialPyroState)
  const { figmaData,figmaFile,loading,token,me } = state
  const firestore = firebase.firestore()
  const fileDB = firestore.collection('figma-files').doc(figmaFile).collection("fileData")
  const pluginVariablesDB = fileDB.doc("pluginUIData").collection("variables")
  const pluginActionsDB = fileDB.doc("pluginUIData").collection("nodeActions")
  const pluginConditionsDB = fileDB.doc("pluginUIData").collection("nodeConditions")
  const pluginFieldsDB = fileDB.doc("pluginUIData").collection("nodeFields")
  const pluginTextsDB = fileDB.doc("pluginUIData").collection("nodeTexts")
  const selectionDB = fileDB.doc("users").collection("selections")
  const querySelect = selectionDB.where("email", "==", me?me.email:'null')
  const [pluginVariables] = useCollectionData(pluginVariablesDB,{idField:'id'})
  const [pluginActions] = useCollectionData(pluginActionsDB,{idField:'id'})
  const [pluginConditions] = useCollectionData(pluginConditionsDB,{idField:'id'})
  const [pluginFields] = useCollectionData(pluginFieldsDB,{idField:'id'})
  const [pluginTexts] = useCollectionData(pluginTextsDB,{idField:'id'})
  const [vectorDB] = useCollectionData(fileDB,{idField:'id'})
  const [selection] = useCollectionData(querySelect,{idField:'id'})

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


    const getSelection =()=>{
      if(selection&&selection.length)dispatch({type:'SET_SELECTION',payload:selection[0]})
    }
    const getVector =()=>{
      if(vectorDB&&vectorDB.length){
        const rotatesDB = vectorDB[1]
        delete rotatesDB.id
        dispatch({type:'SET_ROTATES',payload:rotatesDB})
        dispatch({type:'SET_VECTORS',payload:vectorDB[3]})
      }
    }

    const getPluginState = ()=>{
      if(pluginVariables&&pluginActions&&pluginConditions&&pluginFields&&pluginTexts){

        let pluginVariablesState = pluginVariables.reduce((acc,variable)=>{
          acc[variable.id] = Object.entries(variable.var)[0][1]
          return acc
        },{})
        let pluginFieldsState = pluginFields.reduce((acc,node)=>{
          acc[node.id] = node
          return acc
        },{})
        let pluginTextsState = pluginTexts.reduce((acc,node)=>{
          acc[node.id] = node
          return acc
        },{})

        let pluginActionsState = pluginActions.reduce((acc,node)=>{
          pluginActionsDB.doc(node.id).collection('actions').get()
          .then(snap=>{
            const actions = {}
            snap.forEach(doc => actions[doc.id] = doc.data())
            acc[node.id] = actions
          })
          return acc
        },{})

        let pluginConditionsState = pluginConditions.reduce((acc,node)=>{
          pluginConditionsDB.doc(node.id).collection('conditions').get()
          .then(snap=>{
            const conditions = {}
            snap.forEach(doc => conditions[doc.id] = doc.data())
            acc[node.id] = conditions
          })
          return acc
        },{})

        dispatch({type:'SET_PLUGIN_STATE',payload:{pluginVariables:pluginVariablesState,pluginActions:pluginActionsState,pluginConditions:pluginConditionsState,pluginFields:pluginFieldsState,pluginTexts:pluginTextsState}})
      }
    }
    useEffect(()=>{
      if(figmaData&&token)GetMe(token,dispatch)
    },[figmaData,token])
    useEffect(getSelection,[selection])
    useEffect(getVector,[vectorDB])
    useEffect(retrieveToken,[])
    useEffect(getPluginState,[pluginVariables,pluginActions,pluginConditions,pluginFields,pluginTexts])
  return (
    <PyroDispatchContext.Provider value={dispatch}>
      <PyroStateContext.Provider value={state}>
        <Prototype/>
      </PyroStateContext.Provider>
    </PyroDispatchContext.Provider>
  )
}

export default App
