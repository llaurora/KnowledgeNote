import React from "react";
import {Route} from "react-router-dom";
import {fromJS} from "immutable";
import {immutableRenderDecorator} from "react-immutable-render-mixin";
import asyncComponent from "../asyncComponent/asyncComponent.jsx";//按需加载
import "./layout.scss";

const Aside=asyncComponent(()=>import("./aside/aside.jsx"));
const Home=asyncComponent(()=>import("../../app/home/home.jsx"));//主页
const PageOne=asyncComponent(()=>import("../../app/pageOne/pageOne.jsx"));//第一页
const PageTwo=asyncComponent(()=>import("../../app/pageTwo/pageTwo.jsx"));//第二页

@immutableRenderDecorator
class Layout extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div id="mainBox">
                <Aside/>
                <section>
                    <Route exact path="/" component={Home}/>
                    <Route path="/pageOne" component={PageOne}/>
                    <Route path="/pageTwo" component={PageTwo}/>
                </section>
            </div>
        )
    }
}

export default Layout