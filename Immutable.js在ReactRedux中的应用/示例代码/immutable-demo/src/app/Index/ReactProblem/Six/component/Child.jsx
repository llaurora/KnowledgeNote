import React from 'react';
import Immutable from 'immutable';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';

@immutableRenderDecorator
export default class Child extends React.Component {
  static propTypes = {
    $person: ImmutablePropTypes.map,
  };

  constructor(props) {
    super(props);
    this.state = {
      $state: Immutable.Map({
        childNum: 0,
      }),
    };
  }

  render() {
    const { $state } = this.state;
    const { $person } = this.props;
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
