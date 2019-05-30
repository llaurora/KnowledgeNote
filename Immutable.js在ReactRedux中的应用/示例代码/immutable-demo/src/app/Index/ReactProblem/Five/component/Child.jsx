import React from 'react';
import Immutable from 'immutable';

export default class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      $state: Immutable.Map({
        childNum: 0,
      }),
    };
  }

  shouldComponentUpdate(nextProps = {}, nextState = {}) {
    const thisProps = this.props || {};
    const thisState = this.state || {};
    let isEqual = false;
    if (
      Object.keys(thisProps).length !== Object.keys(nextProps).length ||
      Object.keys(thisState).length !== Object.keys(nextState).length
    ) {
      isEqual = true;
    }

    Object.keys(nextProps).forEach(key => {
      if (!Immutable.is(thisProps[key], nextProps[key])) {
        isEqual = true;
      }
    });

    Object.keys(nextState).forEach(key => {
      if (!Immutable.is(thisState[key], nextState[key])) {
        isEqual = true;
      }
    });

    return isEqual;
  }

  render() {
    const { $state } = this.state;
    const { $person } = this.props; // eslint-disable-line
    console.log($state.get('childNum'), '使用Immutable渲染次数');
    return (
      <div>
        <h5>我是子组件</h5>
        <p>
          名字:{$person.get('name')},年龄：{$person.get('age')}
        </p>
      </div>
    );
  }
}
