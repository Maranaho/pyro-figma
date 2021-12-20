import { useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import SignOut from '../SignOut'
import './UserNotAllowed.css'

const UserNotAllowed = ()=>{

  const { onBoarding } = useContext(PyroStateContext)

  return (
    <main className="UserNotAllowed">
      <h1>User not allowed</h1>
      <p>Better design coming soon</p>
      <SignOut/>
    </main>
  )
}
export default UserNotAllowed
