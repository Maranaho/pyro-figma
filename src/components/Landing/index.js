import React ,{ useState } from 'react'
import { useParams } from 'react-router-dom'
import './Landing.css'
const Landing = ()=>{
  const FIGMA_CLIENT_ID = process.env.REACT_APP_FIGMA_CLIENT_ID
  const { params } = useParams()
  const decodedParams = atob(params)
  const fileKey = decodedParams.split('**')[0]
  const [ cancel,setCancel ] = useState(false)
  const [ resetEmail,setResetEmail ] = useState(true)
  const [ email,setEmail ] = useState(decodedParams.split('**')[1])
  const [ tempEmail,setTempEmail ] = useState(decodedParams.split('**')[1])
  const testingUrl = "http://localhost:3000"
  const prodUrl = "https://maranaho.com"
  const actionUrl = "https://www.figma.com/oauth?client_id="+FIGMA_CLIENT_ID+"&redirect_uri="+testingUrl+"/figma/prototype&scope=file_read&state=pyro&response_type=code"
  const handleSubmit = e=>{
    e.preventDefault()
    if(!cancel){
      setEmail(tempEmail)
      saveParams(tempEmail)
    }
    setResetEmail(true)
    setCancel(false)
  }

  const saveParams = email =>{
    window.localStorage.setItem('email',email)
    window.localStorage.setItem('fileKey',fileKey)
  }
  return (
    <main className="Landing">
      <section>
        <h2>You will be logged in as</h2>
        <form onSubmit={handleSubmit} className="resetEmail">
          <input
            className={`emailInput ${!resetEmail?'type':''}`}
            onChange={e=>setTempEmail(e.target.value)}
            type="email"
            readOnly={resetEmail}
            value={tempEmail}/>
          {!resetEmail&&(
            <div className="formBtnCtn">
                <button onClick={()=>setCancel(true)} className="shallowLink">Cancel</button>
                <button className="btn full">Looking good</button>
              </div>
          )}
        </form>
      </section>
      <p>Is this the email you use for your Figma file?</p>
      <p>If the email is incorrect,access to this file will be denied.</p>
      {resetEmail&&(
        <div className="btnCtn">
          <span onClick={()=>setResetEmail(false)} className="shallowLink">Nope, change my email</span>
          <button className="btn full"><a href={actionUrl}>Yep, Allow access</a></button>
        </div>
      )}
    </main>
  )
}

export default Landing
