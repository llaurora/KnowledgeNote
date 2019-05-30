import React from 'react';
import Immutable from 'immutable';
import Child from './component/Child';

export default class Six extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      $state: Immutable.fromJS({
        count: 0,
        name: '小白',
        age: 20,
      }),
    };
  }

  clickMe = () => {
    this.setState(({ $state }) => ({
      $state: Immutable.merge($state, {
        count: $state.get('count') + 1,
        name: '小白',
        age: 20,
      }),
    }));
  };

  render() {
    const { $state } = this.state;
    const $person = Immutable.Map({
      name: $state.get('name'),
      age: $state.get('age'),
    });
    return (
      <div className="card">
        <h3>5、使用Immutable控制SCU</h3>
        <p className="discribe">
          1、借助第三方库react-immutable-render-mixin控制SCU；
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          2、借助第三方库react-immutable-proptypes做Immutable对象类型检测；
        </p>
        <hr />
        <div className="operate">
          <button type="button" onClick={this.clickMe}>
            点我
          </button>
          <p>
            当前数字<span>{$state.get('count')}</span>
          </p>
        </div>
        <hr />
        <Child $person={$person} />
      </div>
    );
  }
}
