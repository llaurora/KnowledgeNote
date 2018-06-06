import {fromJS} from "immutable";

export default function selectedMemberReducer(
    $selectedMember=fromJS({
        name:"",
        sex:"",
        shopping:[]
    }),
    action) {
    switch (action.type) {
        case "STORE_MEMBER_DETAIL_DATA":
            return $selectedMember.merge(action.data);
        default:
            return $selectedMember
    }
}