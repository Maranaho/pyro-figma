const Debounce = (cb,delay)=>{
  let timer
  return ()=>{
    clearTimeout(timer)
     timer = setTimeout(()=>{
       cb()
     },delay)
  }
}

export default Debounce
