import React from "react";
import {fromJS,List} from "immutable";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as pageTwo from "../../../redux/pageTwo/pageTwoAction.jsx";
import Api from "../../../api/api.jsx";

@connect(
    null,
    dispatch=>bindActionCreators({...pageTwo},dispatch)
)

class LeftPart extends React.Component{
    static propTypes = {
        getMemberDetailData:PropTypes.func
    };
    constructor(props){
        super(props);
        this.getMemberDetail=this.getMemberDetail.bind(this);
    }
    getMemberDetail(item){
        this.props.getMemberDetailData(Api.getMemberDetail,{
            id:item.get("id")
        })
    }
    render(){
        let $memberList=fromJS([
            {id:11,name:"小白"},
            {id:22,name:"小黑"},
            {id:33,name:"小灰"}
        ]);
        return(
            <ul>
                {
                    $memberList.map((item,i)=>{
                        return(
                            <li key={item.get("id")} onClick={()=>{this.getMemberDetail(item)}}>
                                <span>ID是：{item.get("id")}</span>,
                                <span>名字是{item.get("name")}</span>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}

export default LeftPart