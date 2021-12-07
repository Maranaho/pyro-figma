const floatToRGB = channel =>{
  if (channel!== 0 && channel!== 1) return channel*255
  else if(channel === 1) return 255
  else return channel
}
const RenderedColor = ({r,g,b}) => 'rgb('+floatToRGB(r)+','+floatToRGB(g)+','+floatToRGB(b)+')'
export default RenderedColor
