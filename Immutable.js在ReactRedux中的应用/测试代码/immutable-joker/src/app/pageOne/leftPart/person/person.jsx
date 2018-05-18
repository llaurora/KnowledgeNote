import React from "react";

class Person extends React.PureComponent{
    constructor(props){
        super(props)
    }
    render(){
        console.log("我re-render了");
        let {name,age}=this.props;
        return(
            <li>
                名字是：{name}，
                年龄是：{age}
            </li>
        )
    }
}

export default Person