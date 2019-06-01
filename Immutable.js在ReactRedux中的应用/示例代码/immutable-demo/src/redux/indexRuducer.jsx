import { combineReducers } from 'redux-immutable';
import $loginInfo from './Login/loginReducer';

const rootReducer = combineReducers({
  $loginInfo,
});

export default rootReducer;
