import React from 'react';
import Immutable from 'immutable';
import { formatData } from '@util';

const prodData = Immutable.fromJS(formatData());

export default class Four extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      takeUpTime: 0,
    };
  }

  clickMe = (data, key) => {
    const start = new Date().getTime();
    const newData = data.update(key, item => item.update('isShow', ishow => !ishow)); // eslint-disable-line
    const end = new Date().getTime();
    this.setState({ takeUpTime: end - start });
  };

  render() {
    const { takeUpTime } = this.state;
    return (
      <div className="card">
        <h2>4、使用Immutable</h2>
        <p className="discribe">
          这儿忽略了构造Immutable对象的消耗，其实构造Immutable对象效率是超不过Js原生对象的构造的
        </p>
        <hr />
        <div className="operate">
          <button type="button" onClick={() => this.clickMe(prodData, 'key9')}>
            点我
          </button>
          <p>
            耗时<span>{takeUpTime}ms</span>
          </p>
        </div>
      </div>
    );
  }
}
