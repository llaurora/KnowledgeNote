import React from "react";
import "./pageTwo.scss";

import LeftPart from "./leftPart/leftPart.jsx";
import CenterPart from "./centerPart/centerPart.jsx";

class PageTwo extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="pageTwo">
                <LeftPart/>
                <CenterPart/>
            </div>
        )
    }
}

export default PageTwo