import React from 'react';

export default class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      childNum: 0,
    };
  }

  render() {
    const { childNum } = this.state;
    console.log(childNum, '父组件状态改变子组件渲染次数');
    return (
      <div>
        <h5>我是子组件</h5>
      </div>
    );
  }
}
