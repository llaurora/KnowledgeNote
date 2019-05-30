import React from 'react';
import _ from 'lodash';
import { formatData } from '@util';

const prodData = formatData();

export default class Two extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      takeUpTime: 0,
      takeUpTime2: 0,
    };
  }

  clickMe = (data, key) => {
    const start = new Date().getTime();
    const newData = _.assign({}, data, { // eslint-disable-line
      [key]: _.assign({}, data[key], { isShow: !data[key].isShow }),
    });
    const end = new Date().getTime();
    this.setState({ takeUpTime: end - start });
  };

  clickMe2 = (data, key) => {
    const start = new Date().getTime();
    const newData = _.cloneDeep(data);
    newData[key].isShow = !newData[key].isShow;
    const end = new Date().getTime();
    this.setState({ takeUpTime2: end - start });
  };

  render() {
    const { takeUpTime, takeUpTime2 } = this.state;
    return (
      <div className="card">
        <h2>2、使用lodash</h2>
        <hr />
        <div className="operate">
          <button type="button" onClick={() => this.clickMe(prodData, 'key9')}>
            点我
          </button>
          <p>
            耗时<span>{takeUpTime}ms</span>
          </p>
        </div>
        <div className="operate">
          <button type="button" onClick={() => this.clickMe2(prodData, 'key9')}>
            点我2
          </button>
          <p>
            耗时<span>{takeUpTime2}ms</span>
          </p>
        </div>
      </div>
    );
  }
}
