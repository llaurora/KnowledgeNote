import React from 'react';

export default class Child extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      childNum: 0,
    };
  }

  render() {
    const { childNum } = this.state;
    const { person:{name, age} } = this.props; // eslint-disable-line
    console.log(childNum, 'PureComponent存在问题渲染次数');
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
