import React from 'react';
import Child from './component/Child';

export default class Four extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      name: '小白',
      age: 20,
    };
  }

  clickMe = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }));
  };

  render() {
    const { count, name, age } = this.state;
    const person = { name, age };
    return (
      <div className="card">
        <h3>4、使用lodash控制SCU</h3>
        <p className="discribe">
          在子组件里面手动控制shouldComponentUpdate,使用lodash去做deepCompare
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
        <Child person={person} />
      </div>
    );
  }
}
