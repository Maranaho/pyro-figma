const GetMe = (token,dispatch) =>{
  const myHeaders = new Headers()
  myHeaders.append("Authorization", "Bearer " + token)

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  }
  fetch("https://api.figma.com/v1/me", requestOptions)
    .then(res => res.json())
    .then(res => dispatch({type:'GET_ME',payload:res}))
    .catch(err => console.error(err))
 }

export default GetMe
