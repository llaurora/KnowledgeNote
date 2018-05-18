import React from "react";
import {NavLink} from "react-router-dom";
import "./aside.scss";

class Aside extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <ul id="asideNav">
                <li>
                    <NavLink to="/pageOne" activeClassName="navActive">
                        <span>第一页</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/pageTwo" activeClassName="navActive">
                        <span>第二页</span>
                    </NavLink>
                </li>
            </ul>
        )
    }
}

export default Aside


