import React from 'react';
import Child from './component/Child';

export default class Three extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      name: '小白',
      age: 20,
      pers: {
        name: '小白',
        age: 20,
      },
    };
  }

  clickMe = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
      // pers: {
      //   name: '小白',
      //   age: 20,
      // },
    }));
  };

  render() {
    const { count, name, age, pers } = this.state;
    const person = { name, age };
    return (
      <div className="card">
        <h3>3、使用PureComponent问题</h3>
        <p className="discribe">
          使用PureComponent虽然可在某些情况下避免子组件的渲染，但仅限于浅比较，当出现下面几
          种情况的时候PureComponent不再好使；
          <br />
          1、传过去的值是嵌套层，而且嵌套层不是直接在state里面初始化的状态，后期改造；
          <br />
          2、传过去的值是嵌套层，而且也是在state里面初始化的，只是操作的时候，里面的值并没有发生改变；
        </p>
        <hr />
        <div className="operate">
          <button type="button" onClick={this.clickMe}>
            点我
          </button>
          <p>
            当前数字<span>{count}</span>
          </p>
        </div>
        <hr />
        <Child person={pers} />
      </div>
    );
  }
}
