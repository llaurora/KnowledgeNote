import React from 'react';
import { GridLayout } from '../../../components/GridLayout';
import One from './One';
import Two from './Two';
import Three from './Three';
import Four from './Four';
import Five from './Five';
import Six from './Six';
import './style.scss';

export default function ReactProblem() {
  const gridParams = {
    nodeList: [<One />, <Two />, <Three />, <Four />, <Five />, <Six />],
    len: 3,
    rowHeight: '50vh',
    rowSpace: '20px',
    colSpace: '20px',
  };
  return <GridLayout gridParams={gridParams} />;
}
