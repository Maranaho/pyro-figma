import { useState,useEffect,useContext } from 'react'
import PyroStateContext from '../context/PyroStateContext'
import { firestore } from '../Utils/firebase'

const useAssets = ()=>{
  const { figmaFile } = useContext(PyroStateContext)
  const [assets,setAssets] = useState(null)

  useEffect(()=>{
    const unSub = firestore
    .collection('figma-files')
    .doc(figmaFile)
    .collection('fileImages')
    .onSnapshot(snap=>{
      const dbAssets = snap.docs.reduce((acc,doc)=>{
        acc[doc.id] = {...doc.data()}
        return acc
      },{})
      setAssets(dbAssets)
    })

    return ()=> unSub()
  },[])


  return assets
}

export default useAssets
