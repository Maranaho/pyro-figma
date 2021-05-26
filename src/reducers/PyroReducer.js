let initialPyroState = {
  loading:true,
  isMobile:true,
  figmaData:null,
  currentFrameIDX:0,
  currentPageIDX:0,
  protoWidth:375,
  protoHeight:812,
  smoov:false,
  token:null
}

const PyroReducer = (state, action) => {
  switch (action.type) {

    case 'REMOVE_SMOOV':
      let REMOVE_SMOOV = {...state}
      REMOVE_SMOOV.smoov = false
    return REMOVE_SMOOV;

    case 'SET_DESKTOP':
      let SET_DESKTOP = {...state}
      SET_DESKTOP.smoov = true
      SET_DESKTOP.protoWidth = window.innerWidth
      SET_DESKTOP.protoHeight = window.innerHeight - 34
    return SET_DESKTOP;

    case 'SET_MOBILE':
      let SET_MOBILE = {...state}
      SET_MOBILE.smoov = true
      SET_MOBILE.protoWidth = 375
      SET_MOBILE.protoHeight = 812
    return SET_MOBILE;

    case 'SET_WIDTH':
      let SET_WIDTH = {...state}
      SET_WIDTH.protoWidth = action.payload
    return SET_WIDTH;

    case 'SET_HEIGHT':
      let SET_HEIGHT = {...state}
      SET_HEIGHT.protoHeight = action.payload
    return SET_HEIGHT;

    case 'SET_CURRENT_FRAME_IDX':
      let SET_CURRENT_FRAME_IDX = {...state}
      SET_CURRENT_FRAME_IDX.currentFrameIDX = action.payload
    return SET_CURRENT_FRAME_IDX;

    case 'SET_CURRENT_PAGE_IDX':
      let SET_CURRENT_PAGE_IDX = {...state}
      SET_CURRENT_PAGE_IDX.currentPageIDX = action.payload
    return SET_CURRENT_PAGE_IDX;

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
