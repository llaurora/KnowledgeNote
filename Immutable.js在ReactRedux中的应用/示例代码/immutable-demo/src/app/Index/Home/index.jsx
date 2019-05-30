import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

@connect(
  // state => ({
  //   userName: state.loginInfo.userInfo.userName,
  // }), // 从redux状态树用什么取什么
  ({
    loginInfo: {
      userInfo: { userName },
    },
  }) => ({
    userName,
  }), // 从redux状态树用什么取什么
  null,
)
export default class Home extends Component {
  static propTypes = {
    userName: PropTypes.string,
  };

  render() {
    const { userName } = this.props;
    return <span>Hi,欢迎你，{userName}</span>;
  }
}
