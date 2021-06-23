import { useContext } from 'react'
import PyroStateContext from '../../context/PyroStateContext'
import AllowAccess from '../AllowAccess'
import ConfirmEmail from '../ConfirmEmail'
import OnboardingSteps from '../OnboardingSteps'
import './Landing.css'

const Landing = ()=>{

  const { onBoarding } = useContext(PyroStateContext)
  let onBoardingStep
  switch (onBoarding) {
    case 0:onBoardingStep = <ConfirmEmail/>;break;
    case 1:onBoardingStep = <AllowAccess/>;break;
    default: onBoardingStep = <ConfirmEmail/>
  }

  return (
    <main className="Landing">
      <OnboardingSteps/>
      {onBoardingStep}
    </main>
  )
}
export default Landing
