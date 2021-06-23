import React ,{ useContext,useState } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import './OnboardingSteps.css'

const OnboardingSteps = ()=>{

  const { onBoarding } = useContext(PyroStateContext)

  return (
    <main className="OnboardingSteps">
      <p>{onBoarding+1}/3</p>
    </main>
  )
}

export default OnboardingSteps
