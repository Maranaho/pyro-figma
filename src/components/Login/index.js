import { useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import SignIn from '../SignIn'
import './Login.css'

const Login = ()=>{

  const { onBoarding } = useContext(PyroStateContext)

  return (
    <main className="Login">
      <h1>Login</h1>
      <p>Better design coming soon</p>
      <SignIn/>
    </main>
  )
}
export default Login
