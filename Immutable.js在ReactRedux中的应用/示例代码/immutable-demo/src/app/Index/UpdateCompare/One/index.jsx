import React from 'react';
import { formatData } from '@util';

const prodData = formatData();

const testData = { // eslint-disable-line
  key1: { index: 1, isShow: false },
  key2: { index: 2, isShow: false },
  key3: { index: 3, isShow: false },
  key4: { index: 4, isShow: false },
  key5: { index: 5, isShow: false },
  key6: { index: 6, isShow: false },
  key7: { index: 7, isShow: false },
  key8: { index: 8, isShow: false },
  key9: { index: 9, isShow: false },
  key10: { index: 10, isShow: false },
  key11: { index: 11, isShow: false },
  key12: { index: 12, isShow: false },
  key13: { index: 13, isShow: false },
  key14: { index: 14, isShow: false },
  key15: { index: 15, isShow: false },
  key16: { index: 16, isShow: false },
  key17: { index: 17, isShow: false },
  key18: { index: 18, isShow: false },
  key19: { index: 19, isShow: false },
  key20: { index: 20, isShow: false },
  key21: { index: 21, isShow: false },
  key22: { index: 22, isShow: false },
  key23: { index: 23, isShow: false },
  key24: { index: 24, isShow: false },
  key25: { index: 25, isShow: false },
  key26: { index: 26, isShow: false },
  key27: { index: 27, isShow: false },
  key28: { index: 28, isShow: false },
  key29: { index: 29, isShow: false },
  key30: { index: 30, isShow: false },
  key31: { index: 31, isShow: false },
  key32: { index: 32, isShow: false },
  key33: { index: 33, isShow: false },
  key34: { index: 34, isShow: false },
  key35: { index: 35, isShow: false },
  key36: { index: 36, isShow: false },
  key37: { index: 37, isShow: false },
  key38: { index: 38, isShow: false },
  key39: { index: 39, isShow: false },
  key40: { index: 40, isShow: false },
  key41: { index: 41, isShow: false },
  key42: { index: 42, isShow: false },
  key43: { index: 43, isShow: false },
  key44: { index: 44, isShow: false },
  key45: { index: 45, isShow: false },
  key46: { index: 46, isShow: false },
  key47: { index: 47, isShow: false },
  key48: { index: 48, isShow: false },
  key49: { index: 49, isShow: false },
  key50: { index: 50, isShow: false },
  key51: { index: 51, isShow: false },
  key52: { index: 52, isShow: false },
  key53: { index: 53, isShow: false },
  key54: { index: 54, isShow: false },
  key55: { index: 55, isShow: false },
  key56: { index: 56, isShow: false },
  key57: { index: 57, isShow: false },
  key58: { index: 58, isShow: false },
  key59: { index: 59, isShow: false },
  key60: { index: 60, isShow: false },
};

export default class One extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      takeUpTime: 0,
    };
  }

  clickMe = (data, key) => {
    const start = new Date().getTime();
    const newData = Object.assign({}, data, { // eslint-disable-line
      [key]: Object.assign({}, data[key], { isShow: !data[key].isShow }),
    });
    const end = new Date().getTime();
    this.setState({ takeUpTime: end - start });
  };

  render() {
    const { takeUpTime } = this.state;
    return (
      <div className="card">
        <h2>1、使用javascript</h2>
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
