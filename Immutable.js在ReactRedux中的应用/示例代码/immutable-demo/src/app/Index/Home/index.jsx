import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

function Home({ $userInfo }) {
  return <span>Hi,欢迎你，{$userInfo.get('userName')}</span>;
}

Home.propTypes = {
  $userInfo: ImmutablePropTypes.map,
};

export default connect(
  $state => ({ $userInfo: $state.getIn(['$loginInfo', 'userInfo']) }),
  null,
)(Home);
