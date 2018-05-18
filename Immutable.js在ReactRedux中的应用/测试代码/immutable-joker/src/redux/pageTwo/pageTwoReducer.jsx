import {combineReducers} from "redux-immutable";
import selectedMemberReducer from "./selectedMember/selectedMemberReducer.jsx";

const pageTwoReducer=combineReducers({
    $selectedMember:selectedMemberReducer
});

export default pageTwoReducer
