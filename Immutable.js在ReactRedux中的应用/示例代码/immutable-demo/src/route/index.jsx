import React, { lazy, Suspense } from 'react';
import propTypes from 'prop-types';
import thunk from 'redux-thunk';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { hot } from 'react-hot-loader/root';
import { composeWithDevTools } from 'redux-devtools-extension';
import globalLoading from '../asset/images/globalLoading.gif';
import '../asset/style/common.scss';
import rootReducer from '../redux/indexRuducer'; // 引入Reducer 一般一个项目把所有redcer集中在一个Reducer返回
const store = createStore(
  // 创建应用的唯一的store
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)), // applyMiddleware(thunk,logger)
);

const Login = lazy(() => import('../app/Login')); // 登录页面
const Index = lazy(() => import('../app/Index')); // 登录后主页

const IndexRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      sessionStorage.getItem('username') ? ( // 登录与否 页面验证
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

IndexRoute.propTypes = {
  component: propTypes.any,
  location: propTypes.object,
};

const Loading = () => {
  const style = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  return (
    <div style={{ ...style }}>
      <img src={globalLoading} alt="加载中..." />
    </div>
  );
};

const Routers = () => (
  <Provider store={store}>
    <Suspense fallback={<Loading />}>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <IndexRoute path="/" component={Index} />
        </Switch>
      </Router>
    </Suspense>
  </Provider>
);

export default hot(Routers);
