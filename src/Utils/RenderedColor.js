const floatToRGB = channel =>{
  if (channel!== 0 && channel!== 1) return channel*255
  else if(channel === 1) return 255
  else return channel
}
const RenderedColor = ({r,g,b,a}) => 'rgba('+floatToRGB(r)+','+floatToRGB(g)+','+floatToRGB(b)+','+a+')'
export default RenderedColor
