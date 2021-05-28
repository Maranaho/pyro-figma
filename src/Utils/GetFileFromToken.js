import GetImages from './GetImages'

const GetFileFromToken = (accessToken,dispatch,figmaFile) =>{
  const url = "https://api.figma.com/v1/files/"+  figmaFile +"/"

  const myHeaders = new Headers()
  myHeaders.append("Authorization", "Bearer " + accessToken)

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  }

  dispatch({type:'LOADING'})
  fetch(url, requestOptions)
    .then(res => res.json())
    .then(res => {
      dispatch({type:'UPDATE_FILE_DATA_FROM_FIGMA',payload:res})
      GetImages(figmaFile,accessToken,dispatch)
    })
    .catch(err => console.error({err}))
}

export default GetFileFromToken
