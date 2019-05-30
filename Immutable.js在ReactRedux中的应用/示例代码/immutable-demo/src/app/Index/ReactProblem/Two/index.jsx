import React from 'react';
import Child from './component/Child';

export default class Two extends React.Component {
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
        <h3>2、父组件状态改变使用PureComponent</h3>
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
