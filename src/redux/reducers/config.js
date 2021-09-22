import {
    CONFIG
  } from '../actions/config'
  
  function getConfig(state=null, action){
    switch(action.type){
      case CONFIG:
        return action.value;
      default: 
        return state
    }
  }
  
  export default getConfig