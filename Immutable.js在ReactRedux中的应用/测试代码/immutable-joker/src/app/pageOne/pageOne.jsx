import React from "react";
import "./pageOne.scss";

import LeftPart from "./leftPart/leftPart.jsx";
import CenterPart from "./centerPart/centerPart.jsx";
import RightPart from "./rightPart/rightPart.jsx";

class PageOne extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="pageOne">
                <LeftPart/>
                <CenterPart/>
                <RightPart/>
            </div>
        )
    }
}

export default PageOne