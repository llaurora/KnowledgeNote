import React from 'react';
import _ from 'lodash';
import { formatData } from '@util';

const prodData1 = formatData();
const prodData2 = _.cloneDeep(prodData1);
// const prodData2 = formatData();

export default class One extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      takeUpTime: 0,
      equalSign: 0,
    };
  }

  clickMe = () => {
    const start = new Date().getTime();
    const compareResult = _.isEqual(prodData1, prodData2);
    const end = new Date().getTime();
    this.setState({
      takeUpTime: end - start,
      equalSign: compareResult ? 1 : 2,
    });
  };

  render() {
    const { takeUpTime, equalSign } = this.state;
    let showIsEqual = '';
    switch (equalSign) {
      case 0:
        showIsEqual = '';
        break;
      case 1:
        showIsEqual = '是';
        break;
      case 2:
        showIsEqual = '否';
        break;
      default:
        showIsEqual = '';
    }
    return (
      <div className="card">
        <h2>1、使用lodash</h2>
        <hr />
        <div className="operate">
          <button type="button" onClick={this.clickMe}>
            点我
          </button>
          <p>
            耗时<span>{takeUpTime}ms</span>
          </p>
        </div>
        <p>是否相等：{showIsEqual}</p>
      </div>
    );
  }
}
