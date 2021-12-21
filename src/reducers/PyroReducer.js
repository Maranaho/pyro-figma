let initialPyroState = {
  //figmaFile:"91MpGRzYJyF8ZruHDpUC6r",
  //figmaFile:"cZk5K4u4XGN22bNIsEcojq",
  figmaFile:null,
  authData:null,
  loading:true,
  isMobile:true,
  figmaData:null,
  currentFrameIDX:0,
  currentFrameID:null,
  currentPageIDX:0,
  currentPageID:null,
  protoWidth:375,
  protoHeight:812,
  tabletWidth:1024,
  tabletHeight:728,
  minWidth:324,
  minHeight:394,
  smoov:false,
  onBoarding:0,
  fileImages:null,
  nodeTree:null,
  selection:null,
  vectors:null,
  me:null,
  breakPoints:null,
  currentBreakpoint:0,
  direction:false,
  email:null,
  rotations:null,
  pluginState:null,
  pluginStateChanges:false,
  hoverEnter:null,
  firstFrame:null,
  updateVis:false,
  noPyroProto:false,
  userIsAllowed:false,
  pristine:true,
  userData:null,
  requestSent:false,
  token:null
}
const PyroReducer = (state, action) => {
  switch (action.type) {

    case 'HIDE_REQUEST':
      let HIDE_REQUEST = {...state}
      HIDE_REQUEST.requestSent = false
    return HIDE_REQUEST;

    case 'SHOW_REQUEST':
      let SHOW_REQUEST = {...state}
      SHOW_REQUEST.requestSent = true
    return SHOW_REQUEST;

    case 'AUTHORISE_USER':
      let AUTHORISE_USER = {...state}
      AUTHORISE_USER.userIsAllowed = action.payload
    return AUTHORISE_USER;

    case 'SET_USER':
      let SET_USER = {...state}
      SET_USER.userData = action.payload
    return SET_USER;

    case 'NOT_PRISTINE':
      let NOT_PRISTINE = {...state}
      NOT_PRISTINE.pristine = false
    return NOT_PRISTINE;

    case 'NO_PROTO':
      let NO_PROTO = {...state}
      NO_PROTO.noPyroProto = true
    return NO_PROTO;

    case 'SET_FILEKEY':
      let SET_FILEKEY = {...state}
      SET_FILEKEY.figmaFile= action.payload
    return SET_FILEKEY;

    case 'UPDATE_FIELD_VALUE':
      let UPDATE_FIELD_VALUE = {...state}
      UPDATE_FIELD_VALUE.pluginState.pluginVariables[action.payload.variable] = action.payload.val
      UPDATE_FIELD_VALUE.updateVis = !UPDATE_FIELD_VALUE.updateVis
    return UPDATE_FIELD_VALUE;

    case 'UPDATE_PLUGIN_STATE':
      let UPDATE_PLUGIN_STATE = {...state}
      const update_current = String(UPDATE_PLUGIN_STATE.pluginState.pluginVariables[action.payload.pluginAction.targetVariable.id])
      const update_target = action.payload.pluginAction.targetVariable.targetValue
      if(action.payload.eventType.indexOf('MouseEnter') !== -1) UPDATE_PLUGIN_STATE.hoverEnter = update_current

      let originalVal =  UPDATE_PLUGIN_STATE.pluginState.pluginVariables[action.payload.pluginAction.targetVariable.id]
      if (action.payload.pluginAction.actionType === 'becomes'&&(update_current!==update_target)) {
        UPDATE_PLUGIN_STATE.pluginState.pluginVariables[action.payload.pluginAction.targetVariable.id] = action.payload.pluginAction.targetVariable.targetValue
      }

      if (action.payload.pluginAction.actionType === 'toggles') {
        if(String(UPDATE_PLUGIN_STATE.pluginState.pluginVariables[action.payload.pluginAction.targetVariable.id])==='true'||
          String(UPDATE_PLUGIN_STATE.pluginState.pluginVariables[action.payload.pluginAction.targetVariable.id])==='false'){
            UPDATE_PLUGIN_STATE.pluginState.pluginVariables[action.payload.pluginAction.targetVariable.id] = !UPDATE_PLUGIN_STATE.pluginState.pluginVariables[action.payload.pluginAction.targetVariable.id]
          }
      }


      if(action.payload.eventType.indexOf('MouseLeave') !== -1){
        UPDATE_PLUGIN_STATE.pluginState.pluginVariables[action.payload.pluginAction.targetVariable.id] = UPDATE_PLUGIN_STATE.hoverEnter
        UPDATE_PLUGIN_STATE.hoverEnter = null
      }

      UPDATE_PLUGIN_STATE.updateVis = !UPDATE_PLUGIN_STATE.updateVis
    return UPDATE_PLUGIN_STATE;

    case 'ADD_CONDITION':
      let ADD_CONDITION = {...state}
      if(ADD_CONDITION.pluginState === null) {
        let newCondition = {}
        newCondition['pluginConditions'][action.payload.nodeID] = action.payload.conditions
        ADD_CONDITION.pluginState = newCondition
      } else ADD_CONDITION.pluginState.pluginConditions[action.payload.nodeID] = action.payload.conditions
      ADD_CONDITION.pluginStateChanges = !ADD_CONDITION.pluginStateChanges
      ADD_CONDITION.loading = false
    return ADD_CONDITION;

    case 'SET_PLUGIN_STATE':
      let SET_PLUGIN_STATE = {...state}
      SET_PLUGIN_STATE.pluginStateChanges = !SET_PLUGIN_STATE.pluginStateChanges
      SET_PLUGIN_STATE.pluginState = action.payload
    return SET_PLUGIN_STATE;

    case 'SET_DIRECTION':
      let SET_DIRECTION = {...state}
      SET_DIRECTION.direction = action.payload
    return SET_DIRECTION;

    case 'SET_CURRENT_BPOINT':
      let SET_CURRENT_BPOINT = {...state}
      SET_CURRENT_BPOINT.currentBreakpoint = action.payload
    return SET_CURRENT_BPOINT;

    case 'SET_BREAKPOINTS':
      let SET_BREAKPOINTS = {...state}
      SET_BREAKPOINTS.breakPoints = action.payload
    return SET_BREAKPOINTS;

    case 'SET_SELECTION':
      let SET_SELECTION = {...state}
      //console.log(SET_SELECTION.figmaData.children[SET_SELECTION.currentPageIDX].children[SET_SELECTION.currentFrameIDX]);
      SET_SELECTION.currentPageID = action.payload.currentPage.id
      SET_SELECTION.selection = action.payload.selection
    return SET_SELECTION;

    case 'SET_ROTATES':
      let SET_ROTATES = {...state}
      SET_ROTATES.rotations = action.payload
    return SET_ROTATES;

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
      if(SET_ATTRIBUTE.nodeTree.hasOwnProperty(action.payload.id)){
        SET_ATTRIBUTE.nodeTree[action.payload.id][action.payload.attribute] = action.payload.value
      }
    return SET_ATTRIBUTE;

    case 'ADD_CHILD_ELEMENT':
      let ADD_CHILD_ELEMENT = {...state}
      let startNodeTree = {}
      if(ADD_CHILD_ELEMENT.nodeTree === null){
        startNodeTree[action.payload.id] = action.payload
        ADD_CHILD_ELEMENT.nodeTree = startNodeTree
      } else ADD_CHILD_ELEMENT.nodeTree[action.payload.id] = action.payload

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

    case 'SET_CURRENT_FRAME_ID':
      let SET_CURRENT_FRAME_ID = {...state}
      SET_CURRENT_FRAME_ID.currentFrameID = action.payload
    return SET_CURRENT_FRAME_ID;

    case 'SET_CURRENT_FRAME_IDX':
      let SET_CURRENT_FRAME_IDX = {...state}
      if(action.payload!== undefined)SET_CURRENT_FRAME_IDX.currentFrameIDX = action.payload
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
      UPDATE_FILE_DATA_FROM_FIGMA.authData = action.payload.authData
      UPDATE_FILE_DATA_FROM_FIGMA.figmaData = action.payload.pageData
      //UPDATE_FILE_DATA_FROM_FIGMA.loading = false
      UPDATE_FILE_DATA_FROM_FIGMA.nodeTree = null
    return UPDATE_FILE_DATA_FROM_FIGMA;


    default: throw new Error('Unexpected action');
  }
}

export default PyroReducer
export { initialPyroState }
