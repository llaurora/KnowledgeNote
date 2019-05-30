import React from 'react';
import Child from './component/Child';

export default class One extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
    };
  }

  clickMe = () => {
    this.setState(prevState => ({
      num: prevState.num + 1,
    }));
  };

  render() {
    const { num } = this.state;
    return (
      <div className="card">
        <h3>1、父组件状态改变</h3>
        <p className="discribe">
          当父组件re-render的时候，如果不对子组件里是否渲染（shouldComponentUpdate）做控制，
          每次父组件re-render，子组件re-render
        </p>
        <hr />
        <div className="operate">
          <button type="button" onClick={this.clickMe}>
            点我
          </button>
          <p>
            当前数字<span>{num}</span>
          </p>
        </div>
        <hr />
        <Child />
      </div>
    );
  }
}
