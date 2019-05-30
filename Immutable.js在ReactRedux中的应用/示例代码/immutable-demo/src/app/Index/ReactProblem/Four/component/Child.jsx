import React from 'react';
import _ from 'lodash';

export default class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      childNum: 0,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state)
    );
  }

  render() {
    const { childNum } = this.state;
    const { person:{name, age} } = this.props; // eslint-disable-line
    console.log(childNum, '使用lodash渲染次数');
    return (
      <div>
        <h5>我是子组件</h5>
        <p>
          名字:{name},年龄：{age}
        </p>
      </div>
    );
  }
}
