import React, { lazy } from 'react';
import propTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Aside from './components/Aside';
import './style.scss';

const Home = lazy(() => import('./Home')); // 登录后主页
const UpdateCompare = lazy(() => import('./UpdateCompare')); // 更新键值比较
const DeepCompare = lazy(() => import('./DeepCompare')); // 深比较
const ReactProblem = lazy(() => import('./ReactProblem')); // React存在的一些问题

export default function Index({ history, location }) {
  return (
    <div id="indexArea">
      <Aside history={history} location={location} />
      <div id="routeContent">
        <Route exact path="/" component={Home} />
        <Route path="/updateCompare" component={UpdateCompare} />
        <Route path="/deepCompare" component={DeepCompare} />
        <Route path="/reactProblem" component={ReactProblem} />
      </div>
    </div>
  );
}

Index.propTypes = {
  location: propTypes.object,
  history: propTypes.object,
};
