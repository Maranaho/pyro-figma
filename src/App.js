import { useContext,useEffect,useState } from 'react'
import { firestore } from './Utils/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import PyroStateContext from './context/PyroStateContext'
import PyroDispatchContext from './context/PyroDispatchContext'

import Prototype from './components/Prototype'
import NoPyro from './components/NoPyro'
import './bolt_fonts.css'
import './assets/iconfont/harmonyicons.css'
import './App.css'

const FIGMA_CLIENT_ID = process.env.REACT_APP_FIGMA_CLIENT_ID
const FIGMA_SECRET = process.env.REACT_APP_FIGMA_SECRET
const URL_CB = process.env.REACT_APP_URL_CB
const FIGMA_SESSION = process.env.REACT_APP_FIGMA_SESSION

const App = ()=>{
  const dispatch = useContext(PyroDispatchContext)
  const { pristine,pluginState,noPyroProto,figmaData,figmaFile,loading } = useContext(PyroStateContext)
  const db = firestore.collection('figma-files').doc(figmaFile)
  const fileDB = db.collection("fileData")
  const pluginVariablesDB = fileDB.doc("pluginUIData").collection("variables")
  const pluginActionsDB = fileDB.doc("pluginUIData").collection("nodeActions")
  const pluginConditionsDB = fileDB.doc("pluginUIData").collection("nodeConditions")
  const pluginFieldsDB = fileDB.doc("pluginUIData").collection("nodeFields")
  const pluginTextsDB = fileDB.doc("pluginUIData").collection("nodeTexts")
  const [pluginVariables] = useCollectionData(pluginVariablesDB,{idField:'id'})
  const [pluginActions] = useCollectionData(pluginActionsDB,{idField:'id'})
  const [pluginConditions] = useCollectionData(pluginConditionsDB,{idField:'id'})
  const [pluginFields] = useCollectionData(pluginFieldsDB,{idField:'id'})
  const [pluginTexts] = useCollectionData(pluginTextsDB,{idField:'id'})
  const [vectorDB] = useCollectionData(fileDB,{idField:'id'})

  const waitForPyroState = ()=>{
    if(pristine){
      dispatch({type:'NOT_PRISTINE'})
      return
    }
    if(!pluginConditions)dispatch({type:'RMV_LOADING'})

  }

  // const getSelection =()=>{
  //   if(selection&&selection.length)dispatch({type:'SET_SELECTION',payload:selection[0]})
  // }

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
          const nodeID = node.id
          dispatch({type:'ADD_CONDITION',payload:{nodeID,conditions}})
        })
        return acc
      },{})
      const plugState = {pluginVariables:pluginVariablesState,pluginActions:pluginActionsState,pluginConditions:pluginConditionsState,pluginFields:pluginFieldsState,pluginTexts:pluginTextsState}
      dispatch({type:'SET_PLUGIN_STATE',payload:plugState})
    }
  }

  useEffect(waitForPyroState,[pristine])

  useEffect(getPluginState,[pluginVariables,pluginActions,pluginConditions,pluginFields,pluginTexts])
  if(noPyroProto) return <NoPyro/>
  return <Prototype/>
}

export default App
