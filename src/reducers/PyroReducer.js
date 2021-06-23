let initialPyroState = {
  figmaFile:"91MpGRzYJyF8ZruHDpUC6r",
  loading:true,
  isMobile:true,
  figmaData:null,
  currentFrameIDX:0,
  currentPageIDX:0,
  currentPageID:null,
  protoWidth:375,
  protoHeight:812,
  tabletWidth:1024,
  tabletHeight:728,
  minWidth:375,
  minHeight:400,
  smoov:false,
  onBoarding:0,
  fileImages:null,
  nodeTree:null,
  selection:null,
  vectors:null,
  me:null,
  email:null,
  token:null
}
const PyroReducer = (state, action) => {
  switch (action.type) {

    case 'SET_SELECTION':
      let SET_SELECTION = {...state}
      //console.log(SET_SELECTION.figmaData.document.children[SET_SELECTION.currentPageIDX].children[SET_SELECTION.currentFrameIDX]);
      SET_SELECTION.currentPageID = action.payload.currentPage
      SET_SELECTION.selection = action.payload.selection
    return SET_SELECTION;

    case 'SET_VECTORS':
      let SET_VECTORS = {...state}
      SET_VECTORS.vectors = action.payload
    return SET_VECTORS;

    case 'SET_EMAIL':
      let SET_EMAIL = {...state}
      SET_EMAIL.email = action.payload
    return SET_EMAIL;

    case 'SET_ONBARDING':
      let SET_ONBARDING = {...state}
      SET_ONBARDING.onBoarding = action.payload
    return SET_ONBARDING;

    case 'SET_ATTRIBUTE':
      let SET_ATTRIBUTE = {...state}
      SET_ATTRIBUTE.nodeTree[action.payload.id][action.payload.attribute] = action.payload.value
    return SET_ATTRIBUTE;

    case 'ADD_CHILD_ELEMENT':
      let ADD_CHILD_ELEMENT = {...state}
      if(!ADD_CHILD_ELEMENT.nodeTree)ADD_CHILD_ELEMENT.nodeTree = {}
      ADD_CHILD_ELEMENT.nodeTree[action.payload.id] = action.payload
    return ADD_CHILD_ELEMENT;

    case 'GET_ME':
      let GET_ME = {...state}
      GET_ME.me = action.payload
    return GET_ME;

    case 'GET_IMAGES':
      let GET_IMAGES = {...state}
      GET_IMAGES.fileImages = action.payload
    return GET_IMAGES;

    case 'REMOVE_SMOOV':
      let REMOVE_SMOOV = {...state}
      REMOVE_SMOOV.smoov = false
    return REMOVE_SMOOV;

    case 'SET_TABLET':
      let SET_TABLET = {...state}
      SET_TABLET.smoov = true
      SET_TABLET.protoWidth = SET_TABLET.tabletWidth
      SET_TABLET.protoHeight = SET_TABLET.tabletHeight
    return SET_TABLET;

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

    case 'RESET_CURRENTPAGE':
      let RESET_CURRENTPAGE = {...state}
      RESET_CURRENTPAGE.nodeTree = null
      RESET_CURRENTPAGE.currentPageIDX = action.payload
    return RESET_CURRENTPAGE;

    case 'SET_CURRENT_PAGE_IDX':
      let SET_CURRENT_PAGE_IDX = {...state}
      SET_CURRENT_PAGE_IDX.currentPageIDX = action.payload
    return SET_CURRENT_PAGE_IDX;

    case 'RMV_LOADING':
      let RMV_LOADING = {...state}
      RMV_LOADING.loading = false
    return RMV_LOADING;

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
      UPDATE_FILE_DATA_FROM_FIGMA.nodeTree = null
    return UPDATE_FILE_DATA_FROM_FIGMA;


    default: throw new Error('Unexpected action');
  }
}

export default PyroReducer
export { initialPyroState }
