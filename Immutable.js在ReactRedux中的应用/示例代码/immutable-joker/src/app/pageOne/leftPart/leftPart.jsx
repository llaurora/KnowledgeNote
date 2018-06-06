import React from "react";

import Person from "./person/person.jsx";

class LeftPart extends React.Component{
    constructor(props){
        super(props);
        this.state={
            count:1,
            name:"小白",
            age:20
        };
        this.increaseTimes=this.increaseTimes.bind(this);
    }
    increaseTimes(){
        this.setState({
            count:this.state.count+1,
            name:"小白",
            age:21
        })
    }
    render(){
        let {count,name,age}=this.state;
        return(
            <ul className="leftPart">
                <li>
                    <span>更改次数：更改+{count}</span>
                    <button onClick={this.increaseTimes}>点我</button>
                </li>
                <Person name={name} age={age}/>
            </ul>
        )
    }
}

export default LeftPart