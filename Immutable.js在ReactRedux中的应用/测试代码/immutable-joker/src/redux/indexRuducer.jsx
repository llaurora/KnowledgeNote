import {combineReducers} from "redux-immutable";
import pageTwoReducer from "./pageTwo/pageTwoReducer.jsx";//页面二

const indexReducer=combineReducers({
    $pageTwo:pageTwoReducer
});

export default indexReducer