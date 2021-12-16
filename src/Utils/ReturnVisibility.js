const ReturnVisibility = (pluginState,condition) =>{
  const isC2 = String(condition.condition2)==='true'||String(condition.condition2)==='false'?String(condition.condition2):String(pluginState.pluginVariables[condition.condition2]).toLowerCase()
  const nbC1 = Number(pluginState.pluginVariables[condition.condition1])
  const nbC2 = isC2 === 'mt'?0:Number(isC2)
  const c1 = String(pluginState.pluginVariables[condition.condition1]).toLowerCase()
  let thisString = isC2 === 'mt'?'':isC2
  switch (condition.operator) {
    case 'isEqualTo':
      if(c1 === isC2) return condition.show
      else return !condition.show
    break;
    case 'different':
      if(c1 !== thisString) return condition.show
      else return !condition.show
    break;
    case 'contains':
      const idxC2 = pluginState.pluginVariables[condition.condition1].toLowerCase().indexOf(thisString)
      if(idxC2!== -1) return condition.show
      else return !condition.show
    break;
    case 'isGreaterThan':
      if(isNaN(nbC1)||isNaN(nbC2))return false
      if(nbC1 > nbC2) return condition.show
      else return !condition.show
    break;
    case 'isInferiorTo':
      if(isNaN(nbC1)||isNaN(nbC2))return false
      if(nbC1 < nbC2) return condition.show
      else return !condition.show
    break;
    case 'isGreaterThanOrEqualTo':
      if(isNaN(nbC1)||isNaN(nbC2))return false
      if(nbC1 >= nbC2) return condition.show
      else return !condition.show
    break;
    case 'isInferiorOrEqualTo':
      if(isNaN(nbC1)||isNaN(nbC2))return false
      if(nbC1 <= nbC2) return condition.show
      else return !condition.show
    break;
    default: return 'nothing'
  }

}
export default ReturnVisibility
