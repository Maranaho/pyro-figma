let initialPyroState = {
  loading:true,
  figmaData:null,
  token:null
}

const PyroReducer = (state, action) => {
  switch (action.type) {

    case 'LOADING':
      let LOADING = {...state}
      LOADING.loading = true
    return LOADING;

    case 'TOKEN':
      let TOKEN = {...state}
      TOKEN.token = action.payload
    return TOKEN;

    case 'UPDATE_FILE_DATA_FROM_FIGMA':
      let UPDATE_FILE_DATA_FROM_FIGMA = {...state}
      UPDATE_FILE_DATA_FROM_FIGMA.figmaData = action.payload
      UPDATE_FILE_DATA_FROM_FIGMA.loading = false
    return UPDATE_FILE_DATA_FROM_FIGMA;


    default: throw new Error('Unexpected action');
  }
}

export default PyroReducer
export { initialPyroState }
