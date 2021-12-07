import { useState,useEffect } from 'react'
import { firestore } from '../utils/firebase'

const useAssets = ()=>{
  const [assets,setAssets] = useState(null)

  useEffect(()=>{
    const unSub = firestore
    .collection('motion-gallery-assets')
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
