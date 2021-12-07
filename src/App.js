import { useContext,useEffect,useState } from 'react'
import { firestore } from './Utils/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import PyroStateContext from './context/PyroStateContext'
import PyroDispatchContext from './context/PyroDispatchContext'

import Prototype from './components/Prototype'
import './bolt_fonts.css'
import './assets/iconfont/harmonyicons.css'
import './App.css'

const FIGMA_CLIENT_ID = process.env.REACT_APP_FIGMA_CLIENT_ID
const FIGMA_SECRET = process.env.REACT_APP_FIGMA_SECRET
const URL_CB = process.env.REACT_APP_URL_CB
const FIGMA_SESSION = process.env.REACT_APP_FIGMA_SESSION

const App = ()=>{
  const dispatch = useContext(PyroDispatchContext)
  const { figmaData,figmaFile,loading,token,me } = useContext(PyroStateContext)
  const db = firestore.collection('figma-files').doc(figmaFile)
  const fileDB = db.collection("fileData")
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

  const getData = () =>{
    db.get()
    .then(doc =>{
      if (doc.exists) {
        const {authData,pageData} = doc.data()
        dispatch({type:'UPDATE_FILE_DATA_FROM_FIGMA',payload:{authData,pageData}})
        dispatch({type:'SET_CURRENT_FRAME_ID',payload:pageData.children[0].prototypeStartNodeID})
      } else console.log('App 43')
    }).catch(error => console.log(error))
  }

  const getSelection =()=>{
    if(selection&&selection.length)dispatch({type:'SET_SELECTION',payload:selection[0]})
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

  //useEffect(getSelection,[selection])
  useEffect(getData,[])
  useEffect(getPluginState,[pluginVariables,pluginActions,pluginConditions,pluginFields,pluginTexts])
  return <Prototype/>
}

export default App
