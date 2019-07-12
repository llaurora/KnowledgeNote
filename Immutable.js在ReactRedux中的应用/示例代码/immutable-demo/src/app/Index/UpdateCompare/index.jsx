import React from 'react';
import { GridLayout } from '../../../components/GridLayout';
import One from './One';
import Two from './Two';
import Three from './Three';
import Four from './Four';
import './style.scss';

export default function UpdateCompare() {
  const gridParams = {
    nodeList: [<One />, <Two />, <Three />, <Four />],
    len: 4,
    rowHeight: '100vh',
    rowSpace: '20px',
    colSpace: '20px',
  };
  return <GridLayout gridParams={gridParams} />;
}
