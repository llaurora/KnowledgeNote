import React from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import BaseComponent from "../baseComponent/baseComponent.jsx";

class Person extends BaseComponent{
    static propTypes = {
        $person:ImmutablePropTypes.map
    };
    constructor(props){
        super(props)
    }
    render(){
        console.log("我re-render了");
        let {$person}=this.props;
        return(
            <li>
                名字是：{$person.get("name")}，
                年龄是：{$person.get("age")}
            </li>
        )
    }
}

export default Person