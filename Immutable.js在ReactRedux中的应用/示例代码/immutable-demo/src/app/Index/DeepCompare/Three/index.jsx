import React from 'react';
import Immutable from 'immutable';
import { formatData } from '@util';

const prodData1 = Immutable.fromJS(formatData());
const prodData2 = Immutable.merge(prodData1);
// const prodData2 = Immutable.fromJS(formatData());

export default class Three extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      takeUpTime: 0,
      equalSign: true,
    };
  }

  clickMe = () => {
    const start = new Date().getTime();
    const compareResult = Immutable.is(prodData1, prodData2);
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
        <h2>3、使用Immutable</h2>
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
        <p>prodData1的hasCode值：{Immutable.hash(prodData1)}</p>
        <p>prodData2的hasCode值：{Immutable.hash(prodData2)}</p>
      </div>
    );
  }
}
