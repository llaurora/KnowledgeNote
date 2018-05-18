import React from "react";
import {Route,HashRouter as Router,Switch} from "react-router-dom";
import {Provider} from "react-redux";
import {createStore,applyMiddleware} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from "redux-logger";
import "../asset/style/common.scss";


import asyncComponent from "./asyncComponent/asyncComponent.jsx";//按需加载
import indexReducer from "../redux/indexRuducer.jsx";//引入Reducer 一般一个项目把所有redcer集中在一个Reducer返回
const store=createStore(//创建应用的唯一的store
    indexReducer,
    composeWithDevTools(applyMiddleware(thunk))// applyMiddleware(thunk,logger)
);

const Layout=asyncComponent(()=>import("./layout/layout.jsx"));//登录后主页

const Routers =()=>{
        return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route path="/" component={Layout}/>
                    </Switch>
                </Router>
            </Provider>
        )
};

export default Routers
