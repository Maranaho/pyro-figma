import SignIn from '../SignIn'
import './Login.css'

const Login = ()=>{

  return (
    <main className="Login">
      <section>
        <h1>Welcome 😊</h1>
        <h2>Please sign in <br/>so we can let you in!</h2>
        <p>Let me check if you  have access</p>
        <SignIn/>
      </section>
    </main>
  )
}
export default Login
