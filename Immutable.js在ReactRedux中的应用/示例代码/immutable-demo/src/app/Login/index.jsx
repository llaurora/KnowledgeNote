import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Api from '@api';
import { fetchRequest } from '@util';
import imgLoading from '../../asset/images/loading.svg';
import './style.scss';

import * as loginAction from '../../redux/Login/loginAction'; // Action Creator

@connect(
  null,
  dispatch => bindActionCreators({ ...loginAction }, dispatch),
)
export default class Login extends Component {
  static propTypes = {
    changeLoginState: PropTypes.func,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userPwd: '',
      loading: false,
    };
  }

  componentDidMount() {
    document.addEventListener('keyup', e => {
      if (e.keyCode === 13) {
        this.goLogin();
      }
    });
  }

  goLogin = () => {
    const { userName, userPwd } = this.state;
    if (!userName) {
      alert('请输入用户名');
      return;
    }
    if (!userPwd) {
      alert('请输入密码');
    }
    this.setState({ loading: true });
    const loginUrl =
      process.env.NODE_ENV === 'development' &&
      process.env.NODE_STAGE === 'mock'
        ? 'loginMock'
        : 'loginJson';
    fetchRequest({
      url: Api[loginUrl],
      method: 'get',
    })
      .then(data => {
        setTimeout(() => {
          sessionStorage.setItem('username', data.name);
          this.setState({ loading: false });
          this.props.history.push('/');
          this.props.changeLoginState('CANCEL_LOGIN_STATE', data);
        }, 1500);
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { userName, userPwd, loading } = this.state;
    return (
      <div id="loginArea">
        <ul className="loginContent">
          <li className="title">Immutable Demo</li>
          <li className="userItemBox">
            <input
              type="text"
              placeholder="请输入用户名"
              value={userName}
              onChange={e => this.setState({ userName: e.target.value })}
            />
            <input
              type="password"
              placeholder="请输入密码"
              value={userPwd}
              onChange={e => this.setState({ userPwd: e.target.value })}
            />
          </li>
          {loading ? (
            <li className="loading">
              <img src={imgLoading} alt="loading" />
              <span>登录中...</span>
            </li>
          ) : (
            <li className="loginBotton">
              <button type="button" onClick={this.goLogin}>
                登录
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  }
}
