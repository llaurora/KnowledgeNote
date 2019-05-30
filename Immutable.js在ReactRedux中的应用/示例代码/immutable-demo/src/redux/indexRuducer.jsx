import { combineReducers } from 'redux';
import loginInfo from './Login/loginReducer';

const rootReducer = combineReducers({
  loginInfo,
});

export default rootReducer;
