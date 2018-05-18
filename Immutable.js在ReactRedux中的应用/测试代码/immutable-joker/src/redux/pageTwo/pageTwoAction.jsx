import  Util from "../../components/util/util.jsx";

const getMemberDetailData=(url,body)=>(dispatch)=>{
    Util.fetchHandler({url,body,type:"get"}).then((data)=>{
        dispatch({
            type:"STORE_MEMBER_DETAIL_DATA",
            data
        });
    })
};

const onChangeSelectedIndex=(data)=>({
    type:"STORE_ChAT_CURRENT_SELECTEDINDEX",
    data
});

export {onChangeSelectedIndex,getMemberDetailData}