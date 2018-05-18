import React from "react";
import PropTypes from "prop-types";
import classname from "classnames";
import {fromJS,Map} from "immutable";
import {immutableRenderDecorator} from "react-immutable-render-mixin";
import ImmutablePropTypes from "react-immutable-proptypes";
import classnames from "classnames";
import "./tab.scss";

@immutableRenderDecorator
class Tab extends React.Component{
    static propTypes = {
        $tabMenu:ImmutablePropTypes.list,
        children:PropTypes.node,
        className:PropTypes.string
    };
    constructor(props){
        super(props);
        this.state={
            $state:Map({
                activeIndex:0
            })
        };
        this.getContent=this.getContent.bind(this);
        this.onChangeSelect=this.onChangeSelect.bind(this);
    }
    onChangeSelect(item,activeIndex){
        this.setState(({$state})=>({
            $state:$state.update("activeIndex",()=>activeIndex)
        }));
    }
    getContent(children){
        let {$state}=this.state;
        return children.map((child,index)=>{
            if($state.get("activeIndex")===index){
                return child
            }
        })
    }
    render(){
        let {$tabMenu,children,className}=this.props,{$state}=this.state;
        return(
            <div className={classname("tabControl",className)}>
                <ul>
                    {
                        $tabMenu.map((item,i)=>{
                            return (
                                <li key={i}
                                    className={classnames({activeItem:$state.get("activeIndex")===i})}
                                    onClick={()=>{this.onChangeSelect(item,i)}}
                                >
                                    {item.get("text")}
                                </li>
                            )
                        })
                    }
                </ul>
                {this.getContent(children)}
            </div>
        )
    }
}

class TabPane extends React.Component {
    static propTypes = {
        children:PropTypes.node
    };
    render(){
        const {children ,...props}=this.props;
        return (
            <section {...props} >
                {children || ""}
            </section>
        )
    }
}
Tab.TabPane=TabPane;

export default Tab