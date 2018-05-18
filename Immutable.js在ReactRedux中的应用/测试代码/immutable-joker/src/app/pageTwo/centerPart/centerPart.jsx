import React from "react";
import {connect} from "react-redux";
import ImmutablePropTypes from "react-immutable-proptypes";
import {immutableRenderDecorator} from "react-immutable-render-mixin";

@connect(
    state=>({
        $selectedMember:state.getIn(["$pageTwo","$selectedMember"]),
    }),
    null
)

@immutableRenderDecorator
class CenterPart extends React.Component{
    static propTypes = {
        $selectedMember:ImmutablePropTypes.map,
    };
    constructor(props){
        super(props)
    }
    render(){
        let {$selectedMember}=this.props;
        console.log("看看是否进来了");
        return(
            <div>
                {
                    $selectedMember.get("name") ?
                        <div>
                            <p>姓名：{$selectedMember.get("name")}</p>
                            <p>年龄：{$selectedMember.get("sex")}</p>
                            <p>购物车：</p>
                            <ul>
                                {
                                    $selectedMember.get("shopping").map((item,i)=>{
                                        return(
                                            <li key={item.get("id")}>
                                                <span>商品：{item.get("goods")}</span>，
                                                <span>价格：¥{item.get("price")}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        :
                        <div>
                            名字为空，还什么都没有
                        </div>
                }
            </div>
        )
    }
}

export default CenterPart