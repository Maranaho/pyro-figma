const GetImages = (figmaFile,token,dispatch) =>{
//  console.log({figmaFile,token,dispatch});
  const myHeaders = new Headers()
  myHeaders.append("Authorization", "Bearer " + token)

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  }
  fetch("https://api.figma.com/v1/files/"+figmaFile+"/images", requestOptions)
    .then(res => res.json())
    .then(res => dispatch({type:'GET_IMAGES',payload:res.meta.images}))
    .catch(err => console.error(err))
 }

export default GetImages
