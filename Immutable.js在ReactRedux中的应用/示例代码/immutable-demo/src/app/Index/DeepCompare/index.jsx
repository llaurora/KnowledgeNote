import React from 'react';
import { GridLayout } from '../../../components/GridLayout';
import One from './One';
import Two from './Two';
import './style.scss';

export default function DeepCompare() {
  const gridParams = {
    nodeList: [<One />, <Two />],
    len: 2,
    rowHeight: '100vh',
    rowSpace: '20px',
    colSpace: '20px',
  };
  return <GridLayout gridParams={gridParams} />;
}
