import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
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
      $state: Immutable.Map({
        userName: '1',
        userPwd: '2',
        loading: false,
      }),
    };
  }

  componentDidMount() {
    document.addEventListener('keyup', e => {
      if (e.keyCode === 13) {
        this.goLogin();
      }
    });
  }

  onChange = (e, fileName) => {
    const { value } = e.target;
    this.setState(({ $state }) => ({
      $state: $state.update(fileName, () => value),
    }));
  };

  goLogin = () => {
    const { $state } = this.state;
    if (!$state.get('userName')) {
      alert('请输入用户名');
      return;
    }
    if (!$state.get('userPwd')) {
      alert('请输入密码');
    }
    this.setState(({ $state }) => ({
      $state: $state.update('loading', () => true),
    }));
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
        const immutableData = Immutable.Map(data);
        setTimeout(() => {
          sessionStorage.setItem('username', immutableData.get('name'));
          this.setState(({ $state }) => ({
            $state: $state.update('loading', () => false),
          }));
          this.props.history.push('/');
          this.props.changeLoginState('CANCEL_LOGIN_STATE', immutableData);
        }, 1500);
      })
      .catch(() => {
        this.setState(({ $state }) => ({
          $state: $state.update('loading', () => false),
        }));
      });
  };

  render() {
    const { $state } = this.state;
    return (
      <div id="loginArea">
        <ul className="loginContent">
          <li className="title">Immutable Demo</li>
          <li className="userItemBox">
            <input
              type="text"
              placeholder="请输入用户名"
              value={$state.get('userName')}
              onChange={e => {
                this.onChange(e, 'userName');
              }}
            />
            <input
              type="password"
              placeholder="请输入密码"
              value={$state.get('userPwd')}
              onChange={e => {
                this.onChange(e, 'userPwd');
              }}
            />
          </li>
          {$state.get('loading') ? (
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
