import { useEffect,useState } from 'react'
import useAssets from '../../hooks/useAssets'
import './ImageBG.css'

const ImageBG = ({bg,constraints})=>{
  const [srcUrl,setSrcUrl] = useState(null)
  const storageImages = useAssets()




  const bgBlend = ()=> {
    return {
      width:"100%",
      opacity: bg.opacity,
      mixBlendMode: bg.blendMode.toLowerCase().split('_').join('-')
    }
  }

  const getImageUrl = ()=>{
    if(storageImages&&storageImages.hasOwnProperty(bg.imageHash)){
      setSrcUrl(storageImages[bg.imageHash].downloadURL)
    }
  }

  useEffect(getImageUrl,[storageImages&&Object.keys(storageImages).length])


  return <img style={bgBlend()} src={srcUrl} alt={bg.name}/>
}
export default ImageBG
