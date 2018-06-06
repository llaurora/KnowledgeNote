import React from "react";
import {fromJS,Map,List} from "immutable";

import Person from "./person/person.jsx";

class RightPart extends React.Component{
    constructor(props){
        super(props);
        this.state={
            $state:fromJS({
                count:1,
                person:{
                    name:"小白",
                    age:20
                }
            })
        };
        this.increaseTimes=this.increaseTimes.bind(this);
    }
    increaseTimes(){
        this.setState(({$state})=>(
            {
                $state:$state.update("count",()=>this.state.$state.get("count")+1)
                             .update("person",()=>Map({name:"小白",age:21}))
            }
        ))
    }
    render(){
        let {$state}=this.state;
        return(
            <ul className="rightPart">
                <li>
                    <span>更改次数：更改+{$state.get("count")}</span>
                    <button onClick={this.increaseTimes}>点我</button>
                </li>
                <Person $person={$state.get("person")}/>
            </ul>
        )
    }
}

export default RightPart