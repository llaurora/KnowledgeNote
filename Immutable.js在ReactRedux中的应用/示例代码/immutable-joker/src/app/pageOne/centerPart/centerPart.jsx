import React from "react";

import Person from "./person/person.jsx";

class CenterPart extends React.Component{
    constructor(props){
        super(props);
        this.state={
            count:1,
            person:{
                name:"小白",
                age:20
            }
        };
        this.increaseTimes=this.increaseTimes.bind(this);
    }
    increaseTimes(){
        this.setState({
            count:this.state.count+1,
            person:{
                name:"小白",
                age:20
            }
        })
    }
    render(){
        let {count,person}=this.state;
        return(
            <ul className="centerPart">
                <li>
                    <span>更改次数：更改+{count}</span>
                    <button onClick={this.increaseTimes}>点我</button>
                </li>
                <Person person={person}/>
            </ul>
        )
    }
}

export default CenterPart