const floatToRGB = channel =>{
  if (channel!== 0 && channel!== 1) return channel*255
  else if(channel === 1) return 255
  else return channel
}
const RenderedColor = color => {
  if(color){
    const {r,g,b,a} = color
    const alpha = a?','+a+')':')'
    return 'rgb('+floatToRGB(r)+','+floatToRGB(g)+','+floatToRGB(b)+alpha
  } else return 'rgba(255,255,255,0)'
}
export default RenderedColor
